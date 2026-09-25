// ============================================================================
//  collection-launcher.js  v2  --  Lanceur rapide de la collection
// ----------------------------------------------------------------------------
//  Menu par type -> selecteur de fichier -> action. Version rapide ; pour
//  explorer et voir les fiches, prefere collection-browser.js.
//
//  v2 : DETECTION AUTO du prefixe SD ("/sd" ou "") comme le navigateur, car un
//  chemin nu "/BruceRF" peut tomber sur la flash interne -> "zero files found".
//  API JS Bruce (wiki.bruce.computer). ES5. Emissions/executions confirmees.
// ============================================================================

var dialog  = require("dialog");
var storage = require("storage");

var KNOWN = ["BruceRF","BruceIR","BruceRFID","BruceIBTN","BruceEVIL","BruceBAD","BruceJS"];
var ROOTC = ["/sd","/","/sdcard","/SD","/mnt/sd"];
var BASE = "/";

function baseName(p){ var i=p.lastIndexOf("/"); return i>=0?p.substring(i+1):p; }
function extOf(p){ var b=baseName(p); var d=b.lastIndexOf("."); return d>=0?to_lower_case(b.substring(d+1)):""; }
function join(dir,name){ if(dir===""||dir==="/")return "/"+name; if(dir.charAt(dir.length-1)==="/")return dir+name; return dir+"/"+name; }
function normDir(r){ return (r&&r.length!==undefined)?r:null; }
function tryReaddir(p){ try{ return normDir(storage.readdir(p,{withFileTypes:true})); }catch(eRd){ try{ return normDir(storage.readdir(p)); }catch(eRd2){ return null; } } }
function entryName(e){ if(e===null||e===undefined)return null; if(typeof e==="string")return e; if(typeof e==="number")return null; if(e.name!==undefined&&e.name!==null)return e.name; if(e.n!==undefined&&e.n!==null)return e.n; if(e.fileName!==undefined)return e.fileName; if(e.path!==undefined)return baseName(e.path); return null; }
function rootHasColl(root){ var i,r,j; for(i=0;i<KNOWN.length;i++){ if(tryReaddir(join(root,KNOWN[i])))return true; } r=tryReaddir(root); if(r){ for(j=0;j<r.length;j++){ var n=entryName(r[j]); if(n){ for(i=0;i<KNOWN.length;i++){ if(n===KNOWN[i])return true; } } } } return false; }
function detectRoot(){ var i; for(i=0;i<ROOTC.length;i++){ if(rootHasColl(ROOTC[i]))return ROOTC[i]; } return null; }
function sdRoot(){ return BASE; }

function confirm(title){ return dialog.choice([[title,"yes"],["<< Annuler","no"]])==="yes"; }

// selecteur : essaie d'abord dans le dossier voulu, filtre par extension.
// L'argument extension de pickFile est ambigu selon les builds : on passe SANS
// point (forme canonique). Si le filtre montre tout, ce n'est pas bloquant.
function pick(sub,ext){
  var root=join(BASE,sub);
  if(!tryReaddir(root))root=sdRoot();           // dossier absent -> racine SD
  return dialog.pickFile(root,ext);
}

function doSub(p){ if(!confirm("Transmettre .sub : "+baseName(p)))return; try{ var s=require("subghz"); if(s.transmitFile(p))dialog.success("Envoye",true); else dialog.error("Echec",true);}catch(e1){dialog.error("Erreur Sub-GHz :\n"+e1,true);} }
function doIr(p){ if(!confirm("Emettre .ir : "+baseName(p)))return; try{ var ir=require("ir"); if(ir.transmitFile(p))dialog.success("Emis",true); else dialog.error("Echec",true);}catch(e2){dialog.error("Erreur IR :\n"+e2,true);} }
function doNfc(p){ var a=dialog.choice([["Voir","view"],["Ecrire sur tag vierge","write"],["<< Retour","back"]]); if(a==="view"){dialog.viewFile(p);return;} if(a==="write"){ if(!confirm("Ecrire sur NTAG215 ?"))return; try{ var rf=require("rfid"); if(!rf.load(p)){dialog.error("Chargement impossible",true);return;} if(rf.clone())dialog.success("Ecrit",true); else dialog.error("Echec\nApproche un tag",true);}catch(e3){dialog.error("Erreur RFID :\n"+e3,true);} } }
function doBad(p){ if(!confirm("EXECUTER BadUSB : "+baseName(p)))return; try{ var b=require("badusb"); b.setup(); b.runFile(p); dialog.success("Lance",true);}catch(e4){dialog.error("Erreur BadUSB :\n"+e4,true);} }

function dispatch(p){ var e=extOf(p); if(e==="sub")doSub(p); else if(e==="ir")doIr(p); else if(e==="nfc")doNfc(p); else if(e==="txt")doBad(p); else dialog.viewFile(p); }

function main(){
  var det=detectRoot(); BASE=(det===null?"/":det);
  if(det===null)dialog.error("Collection introuvable\n(essaie collection-browser.js\net son Diagnostic SD)",true);
  while(true){
    var choice=dialog.choice([
      ["[RF]  Sub-GHz   - rejouer une telecom radio (.sub)","sub"],
      ["[IR]  Infrarouge - code TV/clim/projo (.ir)","ir"],
      ["[NFC] Amiibo/NFC - ecrire un tag/amiibo (.nfc)","nfc"],
      ["[USB] BadUSB    - lancer un payload clavier (.txt)","bad"],
      ["[*]   Parcourir tout - tous types","all"],
      ["Quitter","quit"]]);
    if(choice===""||choice==="quit")return;
    var f=null;
    if(choice==="sub"){ f=pick("BruceRF","sub"); if(f)doSub(f); }
    else if(choice==="ir"){ f=pick("BruceIR","ir"); if(f)doIr(f); }
    else if(choice==="nfc"){ f=pick("BruceRFID","nfc"); if(f)doNfc(f); }
    else if(choice==="bad"){ f=pick("BruceBAD","txt"); if(f)doBad(f); }
    else if(choice==="all"){ f=dialog.pickFile(sdRoot(),""); if(f)dispatch(f); }
  }
}

main();
