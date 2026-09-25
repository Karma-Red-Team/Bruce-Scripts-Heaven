// ============================================================================
//  collection-browser.js  v6  --  Split-screen guided catalog (Bruce)
// ----------------------------------------------------------------------------
//  Custom UI: LEFT = vertical carousel of items, RIGHT = Title + description of
//  the highlighted item (updates as you scroll). So you understand every item
//  BEFORE entering or running it. Home: Guide / Search / Browse / Diagnostic.
//
//  Controls: Up/Prev & Down/Next = move ; Select/OK = open ; Esc/Back = back.
//  Uses display + keyboard modules and the theme colors (BRUCE_PRICOLOR...).
//  ES5 only. ASCII text. Transmits/executions are confirmed first.
//  NOTE: if navigation feels off on your board, only the key handling in
//  customMenu() needs tuning - everything else is standard.
// ============================================================================

var dialog   = require("dialog");
var storage  = require("storage");
var display  = require("display");
var keyboard = require("keyboard");

var PAGE_CAP = 400, META_MAX = 60000, MAX_RES = 200, MAX_DIRS = 6000;
var KNOWN = ["BruceRF","BruceIR","BruceRFID","BruceIBTN","BruceEVIL","BruceBAD","BruceJS"];
var ROOTC = ["/sd","/","/sdcard","/SD","/mnt/sd"];
var BASE = "/";
var FAM = {"BruceRF":"RF","BruceIR":"IR","BruceRFID":"RFID","BruceIBTN":"IBTN","BruceEVIL":"EVIL","BruceBAD":"BAD"};

// graphics state (Red Karma palette). BGR toggle: some cheap panels are BGR,
// where our RGB red shows up blue - flip R/B so red stays red. Saved to config.
var W,H,ACC,BG,SEC,WHT,DIM,BGR=false,CFG="/collection.cfg";
function col(r,g,b){ return BGR?display.color(b,g,r):display.color(r,g,b); }
function applyColors(){ ACC=col(229,9,30); DIM=col(120,22,30); BG=col(8,8,10); SEC=col(165,165,175); WHT=col(240,240,240); }
function loadCfg(){ try{ var s=storage.read(CFG); if(typeof s==="string"&&s.indexOf("bgr")>=0)BGR=true; }catch(eCr){} }
function saveCfg(){ try{ storage.write(CFG,(BGR?"bgr":"rgb"),"w"); }catch(eCw){} }
function initGfx(){ W=display.width(); H=display.height(); if(typeof __dirname==="string"&&__dirname!=="")CFG=join(__dirname,"collection.cfg"); loadCfg(); applyColors(); }
function frameCorners(){
  var L=10;
  display.drawLine(0,0,L,0,ACC); display.drawLine(0,0,0,L,ACC);
  display.drawLine(W-1-L,0,W-1,0,ACC); display.drawLine(W-1,0,W-1,L,ACC);
  display.drawLine(0,H-1,L,H-1,ACC); display.drawLine(0,H-1-L,0,H-1,ACC);
  display.drawLine(W-1-L,H-1,W-1,H-1,ACC); display.drawLine(W-1,H-1-L,W-1,H-1,ACC);
}

// --- Learn: one card per family ---------------------------------------------
var GUIDE = {
  intro:"THE SWISS ARMY KNIFE\n\nYour SD card holds wireless tools for Bruce. Like a Swiss army knife: many tools, each for a job.\n\nPick a category to learn what it is and how to use it, then browse or use the files.\n\nGOLDEN RULE: only transmit or run on hardware you own, or with permission.",
  choose:"WHICH TOOL?\n\n- Radio remote (gate, garage, outlet, doorbell, pager) -> RF / Sub-GHz\n- TV, A/C, projector, soundbar -> Infrared\n- Badge, card, amiibo -> RFID / NFC\n- Contact key -> iButton\n- Fake WiFi portal -> Evil Portal (native)\n- Make a PC type -> BadUSB",
  RF:{title:"RF / Sub-GHz",folder:"BruceRF",text:"RF / SUB-GHZ (433 / 315 / 868 MHz)\n\nWHAT: low-frequency radio of everyday remotes (gates, garages, doorbells, pagers, outlets, LED strips).\n\nDOES: replays a captured signal (.sub) to reproduce a remote press. Some files are brute-force sweeps.\n\nHOW: open BruceRF, pick a .sub, read the card (frequency, protocol), Transmit. Capture new signals in the native RF menu.\n\nCAUTION: transmitting can open barriers; often illegal without authorization. Jamming is forbidden."},
  IR:{title:"Infrared",folder:"BruceIR",text:"INFRARED\n\nWHAT: IR remotes - TVs, A/C, projectors, soundbars, boxes.\n\nDOES: sends an IR code (.ir): power, volume, source. 'TV-B-Gone' files turn off many TVs.\n\nHOW: open BruceIR (by device type and brand), pick a .ir, Emit while aiming.\n\nCAUTION: mostly harmless; don't turn off other people's screens in public."},
  RFID:{title:"RFID / NFC",folder:"BruceRFID",text:"RFID / NFC\n\nWHAT: 13.56 MHz and 125 kHz badges, amiibo, cards.\n\nDOES: reads, emulates or writes tags. amiibo (NTAG215) can be written to blank tags.\n\nHOW: here, open a .nfc to see its card and write it to a blank NTAG215. Emulate = native RFID menu.\n\nCAUTION: cloning a badge you were not issued is unauthorized access."},
  IBTN:{title:"iButton",folder:"BruceIBTN",text:"iBUTTON\n\nWHAT: 'contact pellet' keys (Dallas 1-Wire) for intercoms and some elevators.\n\nDOES: reads, emulates or writes these keys.\n\nHOW: view a .ibtn card here. Read/emulate = native iButton menu.\n\nCAUTION: only open doors you are allowed to open."},
  EVIL:{title:"Evil Portal",folder:"BruceEVIL",text:"EVIL PORTAL (WiFi)\n\nWHAT: fake WiFi sign-in pages (captive portals) impersonating brands.\n\nDOES: serves a trap page that logs what a victim types. For authorized testing.\n\nHOW: launch from the native WiFi > Evil Portal menu. Here you can only VIEW the pages.\n\nCAUTION: a fake portal against others is a crime. Lab / written authorization only."},
  BAD:{title:"BadUSB / HID",folder:"BruceBAD",text:"BADUSB / HID\n\nWHAT: over USB, Bruce acts as a keyboard and types a script (DuckyScript) fast.\n\nDOES: runs commands on the host. From pranks to real attacks (credential theft, reverse shell).\n\nHOW: open a .txt and Run. READ THE FILE FIRST: it often downloads a second script.\n\nCAUTION: only plug into YOUR machines. Some payloads exfiltrate data."}
};
var GKEYS = ["RF","IR","RFID","IBTN","EVIL","BAD"];

// --- Pokedex: icon + short description ---------------------------------------
var DESC = {
  "BruceRF":{ic:"[RF]",d:"sub-GHz radio remotes"},"BruceIR":{ic:"[IR]",d:"infrared remotes"},
  "BruceRFID":{ic:"[NFC]",d:"RFID/NFC badges & cards"},"BruceIBTN":{ic:"[1W]",d:"iButton contact keys"},
  "BruceEVIL":{ic:"[WIFI]",d:"WiFi trap portals"},"BruceBAD":{ic:"[USB]",d:"BadUSB keyboard payloads"},
  "BruceJS":{ic:"[JS]",d:"Bruce scripts"},
  "Amiibo":{ic:"[AMII]",d:"Switch amiibo (NTAG215)"},"Toniebox":{ic:"[TOY]",d:"Toniebox figures"},
  "Calling":{ic:"[SOS]",d:"service/emergency UIDs"},"mf_classic_dict":{ic:"[KEY]",d:"Mifare key dictionary"},
  "NFC_Files":{ic:"[NFC]",d:"misc NFC dumps"},"StarRFID":{ic:"[NFC]",d:"misc tags"},"Trolling":{ic:"[FUN]",d:"prank tags"},
  "Gates":{ic:"[GATE]",d:"gate remotes"},"Garages":{ic:"[DOOR]",d:"garage door openers"},
  "Doorbells":{ic:"[BELL]",d:"doorbells"},"Jamming":{ic:"[!!]",d:"jamming - illegal"},
  "deBruijn":{ic:"[BF]",d:"de Bruijn brute-force"},"Brujin":{ic:"[BF]",d:"de Bruijn brute-force"},
  "OOK_bruteforce":{ic:"[BF]",d:"OOK brute-force"},"flipperzero-bruteforce":{ic:"[BF]",d:"generated brute-force"},
  "some sort of brute force":{ic:"[BF]",d:"brute-force"},"Restaurant_Pagers":{ic:"[PAGE]",d:"restaurant pagers"},
  "Customer_Assistance_Buttons":{ic:"[BTN]",d:"call buttons"},"Ceiling Fans":{ic:"[FAN]",d:"ceiling fans"},
  "Ceiling_Fans":{ic:"[FAN]",d:"ceiling fans"},"LED":{ic:"[LED]",d:"LED controllers"},
  "Remote_Outlet_Switches":{ic:"[PLUG]",d:"remote power outlets"},"Sprinklers":{ic:"[H2O]",d:"sprinklers"},
  "Training Collars":{ic:"[DOG]",d:"training collars"},"Vehicles":{ic:"[CAR]",d:"vehicle remotes"},
  "Weather Stations":{ic:"[WX]",d:"weather stations"},"TOUCH TUNES":{ic:"[JUKE]",d:"TouchTunes jukebox"},
  "Pocsag":{ic:"[PAGE]",d:"POCSAG paging"},"Car Key Jammer":{ic:"[!!]",d:"car key jamming"},
  "Misc":{ic:"[...]",d:"miscellaneous"},"Untested":{ic:"[?]",d:"untested"},
  "TVs":{ic:"[TV]",d:"televisions"},"ACs":{ic:"[AC]",d:"air conditioners"},"ac":{ic:"[AC]",d:"air conditioners"},
  "Projectors":{ic:"[PROJ]",d:"projectors"},"ProjectorBGone":{ic:"[OFF]",d:"turns projectors off"},
  "IRDB":{ic:"[DB]",d:"community IR database"},"_Converted_":{ic:"[DB]",d:"converted IR database"},
  "Brand_(sorted)":{ic:"[DB]",d:"IR sorted by brand"},"SoundBars":{ic:"[SND]",d:"soundbars"},
  "LED_Lighting":{ic:"[LED]",d:"IR LED lighting"},"Fans":{ic:"[FAN]",d:"fans"},
  "Keys":{ic:"[KEY]",d:"iButton keys"},"StarButton":{ic:"[KEY]",d:"misc keys"},
  "Airlines":{ic:"[AIR]",d:"airlines"},"Hotels":{ic:"[HOTL]",d:"hotels"},"Gyms":{ic:"[GYM]",d:"gyms"},
  "Internet Providers":{ic:"[ISP]",d:"internet providers"},"WiFi Routers":{ic:"[BOX]",d:"routers / gateways"},
  "Supermarkets":{ic:"[SHOP]",d:"supermarkets"},"Theme Parks":{ic:"[FUN]",d:"theme parks"},
  "Railway Companies":{ic:"[RAIL]",d:"railway companies"},"Brands":{ic:"[BRND]",d:"brands"},
  "prank":{ic:"[FUN]",d:"harmless pranks"},"destructive":{ic:"[!!]",d:"destructive payloads"},
  "credentials":{ic:"[!]",d:"credential theft"},"exfiltration":{ic:"[!]",d:"data exfiltration"},
  "BadUSB":{ic:"[USB]",d:"mixed payloads"},"omg-payloads-master":{ic:"[LIB]",d:"O.MG payload library"},
  "BadUSB-FalsePhilosopher":{ic:"[LIB]",d:"large payload archive"},
  "my-flipper-shits":{ic:"[USB]",d:"Linux/CVE/Telegram payloads"},"hak5-official":{ic:"[LIB]",d:"official Hak5 lib"},
  "nullsec-ducky-payloads":{ic:"[USB]",d:"Cloud/DevOps payloads"},"keyboard-layouts":{ic:"[KB]",d:"non-US layouts AZERTY/QWERTZ"},
  "pwnKit":{ic:"[!]",d:"Linux privesc CVE-2021-4034"},"V3sth4cks153-scripts":{ic:"[USB]",d:"macOS/Linux exploits"},
  "Automotive":{ic:"[CAR]",d:"car key fobs (rolling-code)"},"Zero-Sploit-DB":{ic:"[RF]",d:"extra sub-GHz captures"},
  "intercom-keys":{ic:"[1W]",d:"domophone/intercom keys"},"StarNew":{ic:"[KEY]",d:"StarNew intercom keys"},
  "L-ubu-portals":{ic:"[WIFI]",d:"EU airline/rail portals"},"Batcherss":{ic:"[WIFI]",d:"Bruce-native portals"},
  "Borys":{ic:"[WIFI]",d:"portal database"},"nbox-chameleon":{ic:"[KEY]",d:"extended Mifare key dict"}
};

// --- path utils -------------------------------------------------------------
function baseName(p){ if(p==="/"||p==="")return p; var q=p; if(q.charAt(q.length-1)==="/")q=q.substring(0,q.length-1); var i=q.lastIndexOf("/"); return i>=0?q.substring(i+1):q; }
function parentOf(p){ var q=p; if(q.charAt(q.length-1)==="/")q=q.substring(0,q.length-1); var i=q.lastIndexOf("/"); if(i<=0)return "/"; return q.substring(0,i); }
function join(dir,name){ if(dir===""||dir==="/")return "/"+name; if(dir.charAt(dir.length-1)==="/")return dir+name; return dir+"/"+name; }
function extOf(p){ var b=baseName(p); var d=b.lastIndexOf("."); return d>=0?to_lower_case(b.substring(d+1)):""; }
function trimStr(s){ return s?s.replace(/^\s+/,"").replace(/\s+$/,""):""; }
function extIcon(e){ if(e==="sub")return "[sub]"; if(e==="ir")return "[ir]"; if(e==="nfc")return "[nfc]"; if(e==="ibtn")return "[ibtn]"; if(e==="html")return "[html]"; if(e==="txt")return "[txt]"; if(e==="js")return "[js]"; if(e==="raw")return "[raw]"; if(e==="")return "[?]"; return "[.]"; }
function fileHint(e){ if(e==="sub")return "Sub-GHz signal. Open to see frequency, then Transmit."; if(e==="ir")return "Infrared code. Open, then Emit at the device."; if(e==="nfc")return "NFC tag. Open to write it to a blank tag."; if(e==="ibtn")return "iButton key. View only (native menu to emulate)."; if(e==="html")return "Evil Portal page. View only (native WiFi menu)."; if(e==="txt")return "BadUSB payload. READ before you Run it."; return "File. Open to view."; }

// --- disk (tolerant) --------------------------------------------------------
function normDir(r){ return (r&&r.length!==undefined)?r:null; }
function tryReaddir(p){ try{ return normDir(storage.readdir(p,{withFileTypes:true})); }catch(eRd){ try{ return normDir(storage.readdir(p)); }catch(eRd2){ return null; } } }
function readLines(path,size){ if(size&&size>META_MAX)return null; try{ var s=storage.read(path); if(typeof s!=="string")return null; return s.split("\n"); }catch(eRead){ return null; } }
function entryName(e){ if(e===null||e===undefined)return null; if(typeof e==="string")return e; if(typeof e==="number")return null; if(e.name!==undefined&&e.name!==null)return e.name; if(e.n!==undefined&&e.n!==null)return e.n; if(e.fileName!==undefined)return e.fileName; if(e.filename!==undefined)return e.filename; if(e.path!==undefined)return baseName(e.path); if(e.file!==undefined)return e.file; return null; }
function entrySize(e){ if(e&&typeof e==="object"){ if(e.size!==undefined)return e.size; if(e.length!==undefined)return e.length; } return 0; }
function guessDir(e,nm){ if(e&&typeof e==="object"){ if(e.isDirectory!==undefined)return !!e.isDirectory; if(e.isDir!==undefined)return !!e.isDir; if(e.dir!==undefined)return !!e.dir; if(e.directory!==undefined)return !!e.directory; if(e.type!==undefined)return (e.type==="dir"||e.type==="directory"||e.type==="folder"||e.type===1); } return nm.indexOf(".")<0; }

function rootHasColl(root){ var i,r,j; for(i=0;i<KNOWN.length;i++){ if(tryReaddir(join(root,KNOWN[i])))return true; } r=tryReaddir(root); if(r){ for(j=0;j<r.length;j++){ var n=entryName(r[j]); if(n){ for(i=0;i<KNOWN.length;i++){ if(n===KNOWN[i])return true; } } } } return false; }
function detectRoot(){ var i; for(i=0;i<ROOTC.length;i++){ if(rootHasColl(ROOTC[i]))return ROOTC[i]; } return null; }

// --- text drawing helpers ---------------------------------------------------
function clipText(s,maxc){ if(s.length<=maxc)return s; return s.substring(0,maxc-1)+"."; }
function drawWrapped(text,x,y,maxc,lineH,color){
  display.setTextColor(color);
  var paras=(""+text).split("\n"),oy=y,pi;
  for(pi=0;pi<paras.length;pi++){
    var words=paras[pi].split(" "),line="",wi;
    for(wi=0;wi<words.length;wi++){
      var cand=(line===""?words[wi]:line+" "+words[wi]);
      if(cand.length>maxc){ if(line!==""){ display.drawString(line,x,oy); oy+=lineH; line=words[wi]; } else { display.drawString(cand.substring(0,maxc),x,oy); oy+=lineH; line=""; } }
      else line=cand;
    }
    if(line!==""){ display.drawString(line,x,oy); oy+=lineH; }
  }
  return oy;
}

// --- SPLIT-SCREEN MENU ------------------------------------------------------
// entries: [{lab, title, desc, val}]  ; returns {val, sel}
function customMenu(header, entries, startSel){
  var n=entries.length; if(n===0)return {val:"",sel:0};
  var sel=startSel||0; if(sel>=n)sel=0;
  var top=0, redraw=true;
  var leftW=Math.floor(W*0.54), rowH=16, listTop=20, cw=6;
  var rows=Math.floor((H-listTop-12)/rowH);
  var leftChars=Math.floor((leftW-10)/cw), rx=leftW+8, rmaxc=Math.floor((W-rx-6)/cw);
  while(true){
    if(sel<top)top=sel; if(sel>=top+rows)top=sel-rows+1; if(top<0)top=0;
    if(redraw){
      display.fill(BG);
      frameCorners();
      display.setTextSize(1);
      display.setTextColor(ACC); display.drawString(">> "+clipText(header,Math.floor((W-44)/cw)-3),6,4);
      display.setTextColor(DIM); display.drawString("KARMA",W-6-5*cw,4);
      display.drawLine(4,15,W-4,15,ACC); display.drawLine(4,17,W-4,17,DIM);
      display.drawLine(leftW,19,leftW,H-13,ACC);
      var i;
      for(i=0;i<rows;i++){ var idx=top+i; if(idx>=n)break; var y=listTop+i*rowH;
        if(idx===sel){ display.drawFillRect(2,y,leftW-4,rowH-2,ACC); display.setTextColor(BG); display.drawString(">"+clipText(entries[idx].lab,leftChars-1),6,y+3); }
        else { display.setTextColor(WHT); display.drawString(" "+clipText(entries[idx].lab,leftChars-1),6,y+3); }
      }
      if(n>rows){ var sbH=rows*rowH, kh=Math.floor(sbH*rows/n); if(kh<6)kh=6; var ky=listTop+Math.floor(sbH*top/n); display.drawFillRect(leftW-4,ky,2,kh,DIM); }
      var e=entries[sel], ry=listTop;
      display.setTextColor(ACC); display.drawString("//",rx,ry);
      ry=drawWrapped(e.title||e.lab, rx, ry+11, rmaxc, 11, ACC);
      display.drawLine(rx,ry+1,W-6,ry+1,DIM); ry+=6;
      drawWrapped(e.desc||"", rx, ry, rmaxc, 11, SEC);
      display.drawLine(4,H-12,W-4,H-12,DIM);
      display.setTextColor(DIM); display.drawString("UP/DN move   OK open   BACK",6,H-9);
      redraw=false;
    }
    if(keyboard.getPrevPress()){ sel=(sel-1+n)%n; redraw=true; }
    else if(keyboard.getNextPress()){ sel=(sel+1)%n; redraw=true; }
    else if(keyboard.getSelPress()){ return {val:entries[sel].val,sel:sel}; }
    else if(keyboard.getEscPress()){ return {val:"",sel:sel}; }
    delay(20);
  }
}

// --- Diagnostic (uses dialog viewer) ----------------------------------------
function dumpEntry(e){ var s="typeof="+(typeof e); if(typeof e==="string"){ s+=" \""+e+"\""; } else if(e&&typeof e==="object"){ var keys="",kk; for(kk in e){ keys+=kk+" "; } s+=" keys:["+trimStr(keys)+"]"; var nm=entryName(e); if(nm!==null)s+=" name=\""+nm+"\""; } return s; }
function diagnostic(){ var t="SD DIAGNOSTIC\nroot: \""+BASE+"\"\n"; try{ var sp=storage.spaceSDCard(); t+="spaceSDCard: "+(sp?("free="+sp.free):"NOT detected")+"\n"; }catch(eSp){ t+="spaceSDCard: err "+eSp+"\n"; } var a=["/","/sd","/sdcard"],i,j; for(i=0;i<a.length;i++){ var r=tryReaddir(a[i]); t+="\nreaddir(\""+a[i]+"\") = "+(r?(r.length+" entries"):"NULL")+"\n"; if(r&&r.length>0){ t+="  [0] "+dumpEntry(r[0])+"\n"; for(j=0;j<r.length&&j<10;j++){ t+="   - "+entryName(r[j])+"\n"; } } } dialog.viewText(t,"SD Diagnostic"); }

// --- header parsing / file card ---------------------------------------------
function findVal(lines,prefix){ if(!lines)return ""; var i; for(i=0;i<lines.length&&i<60;i++){ if(lines[i].indexOf(prefix)===0)return trimStr(lines[i].substring(prefix.length)); } return ""; }
function countPrefix(lines,prefix){ if(!lines)return -1; var c=0,i; for(i=0;i<lines.length;i++){ if(lines[i].indexOf(prefix)===0)c++; } return c; }
function htmlTitle(lines){ if(!lines)return ""; var joined="",i; for(i=0;i<lines.length&&i<300;i++)joined+=lines[i]+" "; var low=to_lower_case(joined); var a=low.indexOf("<title>"); if(a>=0){ var b=low.indexOf("</title>",a); if(b>a)return trimStr(joined.substring(a+7,b)); } return ""; }
function confirm(title){ return dialog.choice([[title,"yes"],["<< Cancel","no"]])==="yes"; }

function actSub(path){ if(!confirm("Transmit this .sub ?"))return; try{ var s=require("subghz"); if(s.transmitFile(path))dialog.success("Sent",true); else dialog.error("Transmit failed",true);}catch(eSub){dialog.error("Sub-GHz error:\n"+eSub,true);} }
function actIr(path){ if(!confirm("Emit this .ir ?"))return; try{ var ir=require("ir"); if(ir.transmitFile(path))dialog.success("Emitted",true); else dialog.error("IR emit failed",true);}catch(eIr){dialog.error("IR error:\n"+eIr,true);} }
function actNfc(path){ if(!confirm("Write to a blank NTAG215 ?"))return; try{ var rfid=require("rfid"); if(!rfid.load(path)){dialog.error("Load failed",true);return;} if(rfid.clone())dialog.success("Written",true); else dialog.error("Failed\nPresent a blank tag",true);}catch(eNfc){dialog.error("RFID error:\n"+eNfc,true);} }
function actBad(path){ if(!confirm("RUN this BadUSB payload ?"))return; try{ var bad=require("badusb"); bad.setup(); bad.runFile(path); dialog.success("Launched",true);}catch(eBad){dialog.error("BadUSB error:\n"+eBad,true);} }

function fileCard(path,size){
  var e=extOf(path), lines=readLines(path,size), area=baseName(parentOf(path));
  var t=baseName(path)+"\nArea: "+area+"\n"+(size?("Size: "+size+" B\n"):"")+"----\n";
  if(e==="sub"){ var f=findVal(lines,"Frequency:"); t+="Type: Sub-GHz\n"; if(f)t+="Freq: "+f+" Hz ("+(parse_int(f)/1000000)+" MHz)\n"; var pr=findVal(lines,"Protocol:"); if(pr)t+="Protocol: "+pr+"\n"; t+="Transmit replays this signal."; }
  else if(e==="ir"){ t+="Type: Infrared\n"; var nb=countPrefix(lines,"name:"); if(nb>=0)t+="Buttons: "+nb+"\n"; t+="Emit sends an IR code."; }
  else if(e==="nfc"){ t+="Type: RFID/NFC\n"; var dt=findVal(lines,"Device type:"); if(dt)t+="Chip: "+dt+"\n"; var uid=findVal(lines,"UID:"); if(uid)t+="UID: "+uid+"\n"; t+="Write to a blank tag."; }
  else if(e==="ibtn"){ t+="Type: iButton\n"; var ip=findVal(lines,"Protocol:"); if(ip)t+="Protocol: "+ip+"\n"; t+="(emulate = native menu)"; }
  else if(e==="html"){ t+="Type: Evil Portal\n"; var ti=htmlTitle(lines); if(ti)t+="Title: "+ti+"\n"; t+="(portal = native WiFi menu)"; }
  else if(e==="txt"){ t+="Type: BadUSB payload\n"; if(lines&&lines.length>0)t+="1st: "+trimStr(lines[0])+"\n"; t+="Run types this on the host. READ IT."; }
  else t+="Type: ."+e+"\n";
  return {text:t,ext:e};
}
function showFile(path,size){
  var info=fileCard(path,size);
  dialog.viewText(info.text,baseName(path));
  var e=info.ext, opts=[];
  if(e==="sub")opts.push(["Transmit","sub"]); else if(e==="ir")opts.push(["Emit","ir"]);
  else if(e==="nfc")opts.push(["Write to blank tag","nfc"]); else if(e==="txt")opts.push(["Run BadUSB","bad"]);
  opts.push(["View raw file","view"]); opts.push(["<< Back","back"]);
  var a=dialog.choice(opts);
  if(a==="sub")actSub(path); else if(a==="ir")actIr(path); else if(a==="nfc")actNfc(path);
  else if(a==="bad")actBad(path); else if(a==="view"){ try{dialog.viewFile(path);}catch(eV){dialog.error("Cannot read",true);} }
}

// --- context card for a folder ----------------------------------------------
function locInfo(cur,count){
  if(cur===BASE||cur==="/")return {title:"SD card root",text:"SD CARD ROOT\n\nYour Bruce collection lives here. Open the Guide from Home for a full explanation of each area."};
  var name=baseName(cur), fam=FAM[name];
  if(fam)return {title:GUIDE[fam].title,text:GUIDE[fam].text};
  var di=DESC[name];
  return {title:name,text:name+"\n"+(di?("-> "+di.d):"(folder)")+"\nItems here: "+count};
}

// --- browser (split-screen) -------------------------------------------------
function buildEntries(cur){
  var raw=tryReaddir(cur); if(!raw)raw=[];
  var dirs=[],files=[],i;
  for(i=0;i<raw.length;i++){ var nm=entryName(raw[i]); if(nm===null||nm==="")continue; if(guessDir(raw[i],nm))dirs.push(nm); else files.push({nm:nm,sz:entrySize(raw[i])}); }
  dirs.sort(); files.sort(function(a,b){ return a.nm<b.nm?-1:(a.nm>b.nm?1:0); });
  var here=(cur===BASE||cur==="/")?"SD root":baseName(cur), hd=DESC[here];
  var ents=[], sizes={};
  ents.push({lab:"(i) Where am I?",title:here,desc:"Show what this place is and how to use it.",val:"__info"});
  ents.push({lab:"<< Back",title:"Back",desc:"Go up one level.",val:"__up"});
  var count=dirs.length+files.length, cap=0, k;
  for(k=0;k<dirs.length&&cap<PAGE_CAP;k++,cap++){ var dn=dirs[k], di=DESC[dn]; ents.push({lab:(di?di.ic:"[D]")+" "+dn+"/",title:dn,desc:(di?di.d+". Enter to explore.":"Folder. Enter to see what is inside."),val:"D:"+dn}); }
  for(k=0;k<files.length&&cap<PAGE_CAP;k++,cap++){ var fn=files[k].nm; sizes[fn]=files[k].sz; ents.push({lab:extIcon(extOf(fn))+" "+fn,title:fn,desc:fileHint(extOf(fn)),val:"F:"+fn}); }
  if(count>cap)ents.push({lab:"... more items",title:"Too many items ("+count+")",desc:"Use Home > Search to find a file by name.",val:"__nop"});
  return {ents:ents,sizes:sizes,count:count};
}
function browse(start){
  var cur=start, memo={};
  while(true){
    var b=buildEntries(cur);
    var header=(cur===BASE||cur==="/")?"SD ROOT":baseName(cur);
    var res=customMenu(header,b.ents,memo[cur]||0);
    memo[cur]=res.sel; var v=res.val;
    if(v==="")return;                         // Esc = back to caller/home
    if(v==="__info"){ var inf=locInfo(cur,b.count); dialog.viewText(inf.text,inf.title); }
    else if(v==="__up"){ if(cur===BASE||cur==="/")return; cur=parentOf(cur); }
    else if(v==="__nop"){ /* stay */ }
    else if(v.indexOf("D:")===0){ cur=join(cur,v.substring(2)); }
    else if(v.indexOf("F:")===0){ var nm=v.substring(2); showFile(join(cur,nm),b.sizes[nm]===undefined?0:b.sizes[nm]); }
  }
}

// --- search -----------------------------------------------------------------
function getText(title){ try{ var v=dialog.prompt(title,40,""); if(typeof v==="string")return v; }catch(eP){} try{ var kb=require("keyboard"); return kb.keyboard(title,"",0,40); }catch(eK){} return ""; }
function searchIn(q,root){ var ql=to_lower_case(q),res=[],stack=[root],dirs=0; while(stack.length>0&&res.length<MAX_RES&&dirs<MAX_DIRS){ var d=stack.pop(); dirs++; var r=tryReaddir(d); if(!r)continue; var i; for(i=0;i<r.length;i++){ var nm=entryName(r[i]); if(!nm)continue; var full=join(d,nm); if(guessDir(r[i],nm))stack.push(full); else if(to_lower_case(nm).indexOf(ql)>=0){ res.push(full); if(res.length>=MAX_RES)break; } } } return {list:res,capped:(res.length>=MAX_RES||dirs>=MAX_DIRS)}; }
function resultsMenu(list,capped){
  var ents=[],k;
  ents.push({lab:"<< Back",title:"Back"+(capped?" (capped)":""),desc:"Return to Home.",val:"__b"});
  for(k=0;k<list.length;k++){ ents.push({lab:extIcon(extOf(list[k]))+" "+baseName(list[k]),title:baseName(list[k]),desc:"in "+baseName(parentOf(list[k]))+"  -  "+fileHint(extOf(list[k])),val:"I:"+k}); }
  var mem=0;
  while(true){ var res=customMenu("Results ("+list.length+")",ents,mem); mem=res.sel; var v=res.val; if(v===""||v==="__b")return; if(v.indexOf("I:")===0)showFile(list[parse_int(v.substring(2))],0); }
}
function searchFlow(){
  var q=getText("Search (file name)"); if(!q||q==="")return;
  var ents=[],i;
  ents.push({lab:"[*] Whole card (slow)",title:"Whole card",desc:"Search everywhere. Can take a while.",val:BASE});
  for(i=0;i<KNOWN.length;i++){ if(tryReaddir(join(BASE,KNOWN[i]))){ var di=DESC[KNOWN[i]]; ents.push({lab:(di?di.ic:"[D]")+" "+KNOWN[i],title:KNOWN[i],desc:(di?di.d:"")+". Search only here.",val:join(BASE,KNOWN[i])}); } }
  ents.push({lab:"<< Cancel",title:"Cancel",desc:"Back to Home.",val:"__c"});
  var sc=customMenu("Search where?",ents,0); if(sc.val===""||sc.val==="__c")return;
  var out=searchIn(q,sc.val);
  if(out.list.length===0){ dialog.info("No result for:\n"+q,true); return; }
  resultsMenu(out.list,out.capped);
}

// --- guide (Home) -----------------------------------------------------------
function catGuide(key){ var g=GUIDE[key]; dialog.viewText(g.text,g.title); if(g.folder&&tryReaddir(join(BASE,g.folder))){ if(dialog.choice([["Browse "+g.folder,"go"],["<< Back","no"]])==="go")browse(join(BASE,g.folder)); } }
function guideHome(){
  var ents=[{lab:"Overview",title:"Overview",desc:"The big picture: what this collection is.",val:"intro"}],i;
  for(i=0;i<GKEYS.length;i++){ var g=GUIDE[GKEYS[i]],di=DESC[g.folder]; ents.push({lab:(di?di.ic:"")+" "+g.title,title:g.title,desc:(di?di.d:""),val:GKEYS[i]}); }
  ents.push({lab:"Which tool do I need?",title:"Which tool?",desc:"Match your goal to the right tool.",val:"choose"});
  ents.push({lab:"<< Back",title:"Back",desc:"Return to Home.",val:"back"});
  var mem=0;
  while(true){ var res=customMenu("Guide",ents,mem); mem=res.sel; var s=res.val; if(s===""||s==="back")return; if(s==="intro")dialog.viewText(GUIDE.intro,"Overview"); else if(s==="choose")dialog.viewText(GUIDE.choose,"Which tool?"); else catGuide(s); }
}

// --- browse-by-category (Home) ----------------------------------------------
function categoryMenu(){
  var ents=[],i;
  for(i=0;i<KNOWN.length;i++){ if(tryReaddir(join(BASE,KNOWN[i]))){ var di=DESC[KNOWN[i]]; ents.push({lab:(di?di.ic:"[D]")+" "+KNOWN[i],title:KNOWN[i],desc:(di?di.d:""),val:join(BASE,KNOWN[i])}); } }
  ents.push({lab:"[*] Whole card",title:"Whole card",desc:"Explore the SD root.",val:BASE});
  ents.push({lab:"<< Back",title:"Back",desc:"Return to Home.",val:"__b"});
  var mem=0;
  while(true){ var res=customMenu("Browse by category",ents,mem); mem=res.sel; var v=res.val; if(v===""||v==="__b")return; browse(v); }
}

// --- Quick access by real-world theme ---------------------------------------
var THEMES=[
  {ic:"[GATE]",name:"Gate",paths:["BruceRF/Gates"]},
  {ic:"[DOOR]",name:"Garage door",paths:["BruceRF/Garages"]},
  {ic:"[BELL]",name:"Doorbell",paths:["BruceRF/Doorbells"]},
  {ic:"[PLUG]",name:"Power outlet",paths:["BruceRF/Remote_Outlet_Switches"]},
  {ic:"[FAN]",name:"Fan",paths:["BruceRF/Ceiling Fans","BruceRF/Ceiling_Fans","BruceIR/Fans"]},
  {ic:"[LED]",name:"LED lights",paths:["BruceRF/LED","BruceIR/LED_Lighting"]},
  {ic:"[PAGE]",name:"Pager",paths:["BruceRF/Restaurant_Pagers","BruceRF/Pocsag"]},
  {ic:"[CAR]",name:"Vehicle",paths:["BruceRF/Vehicles"]},
  {ic:"[CAR]",name:"Car key fob",paths:["BruceRF/Automotive"]},
  {ic:"[1W]",name:"Intercom / domophone",paths:["BruceIBTN/intercom-keys","BruceIBTN/StarNew","BruceIBTN/Keys","BruceIBTN/StarButton"]},
  {ic:"[H2O]",name:"Sprinkler",paths:["BruceRF/Sprinklers"]},
  {ic:"[TV]",name:"TV",paths:["BruceIR/TVs","BruceIR/Universal_TV_Remotes"]},
  {ic:"[AC]",name:"Air conditioner",paths:["BruceIR/ACs","BruceIR/ac"]},
  {ic:"[PROJ]",name:"Projector",paths:["BruceIR/Projectors","BruceIR/ProjectorBGone"]},
  {ic:"[SND]",name:"Soundbar",paths:["BruceIR/SoundBars"]},
  {ic:"[AMII]",name:"amiibo",paths:["BruceRFID/Amiibo"]},
  {ic:"[JUKE]",name:"Jukebox (TouchTunes)",paths:["BruceRF/TOUCH TUNES"]},
  {ic:"[!!]",name:"Jamming",paths:["BruceRF/Jamming"]}
];
function existingPaths(t){ var out=[],i; for(i=0;i<t.paths.length;i++){ var p=join(BASE,t.paths[i]); if(tryReaddir(p))out.push(p); } return out; }
function openTheme(t){
  var ex=existingPaths(t);
  if(ex.length===0){ dialog.info("No files for:\n"+t.name,true); return; }
  if(ex.length===1){ browse(ex[0]); return; }
  var ents=[],i; for(i=0;i<ex.length;i++)ents.push({lab:baseName(ex[i]),title:baseName(ex[i]),desc:"Open this set.",val:"P:"+i});
  ents.push({lab:"<< Back",title:"Back",desc:"",val:"__b"});
  var mem=0; while(true){ var res=customMenu(t.name,ents,mem); mem=res.sel; var v=res.val; if(v===""||v==="__b")return; if(v.indexOf("P:")===0)browse(ex[parse_int(v.substring(2))]); }
}
function themeMenu(){
  var ents=[],i;
  for(i=0;i<THEMES.length;i++){ if(existingPaths(THEMES[i]).length>0)ents.push({lab:THEMES[i].ic+" "+THEMES[i].name,title:THEMES[i].name,desc:"Jump straight to "+THEMES[i].name+" files.",val:"T:"+i}); }
  ents.push({lab:"<< Back",title:"Back",desc:"Return to Home.",val:"__b"});
  var mem=0;
  while(true){ var res=customMenu("What are you looking at?",ents,mem); mem=res.sel; var v=res.val; if(v===""||v==="__b")return; if(v.indexOf("T:")===0)openTheme(THEMES[parse_int(v.substring(2))]); }
}

// --- Home -------------------------------------------------------------------
function main(){
  initGfx();
  var det=detectRoot();
  if(det===null){ BASE="/"; dialog.error("Collection not found.\nOpen SD Diagnostic\nand send what it shows.",true); diagnostic(); }
  else BASE=det;
  var mem=0;
  while(true){
    var ents=[
      {lab:"Quick: by theme",title:"Quick: by theme",desc:"See a device (A/C, gate, TV, amiibo...) and jump straight to its files.",val:"theme"},
      {lab:"Search",title:"Search a file",desc:"Find a file by name across the collection.",val:"search"},
      {lab:"Browse",title:"Browse by category",desc:"Explore with a description at every level.",val:"browse"},
      {lab:"Guide",title:"Guide: what is all this?",desc:"Learn what each tool is and how to use it.",val:"guide"},
      {lab:"Display: "+(BGR?"BGR":"RGB"),title:"Display color order",desc:"Toggle RGB/BGR. Pick BGR if the red UI shows up blue on your screen. Saved for next time.",val:"disp"},
      {lab:"Diagnostic",title:"SD Diagnostic",desc:"Check how the SD card is read.",val:"diag"},
      {lab:"Quit",title:"Quit",desc:"Exit the catalog.",val:"quit"}];
    var res=customMenu("KARMA - Collection",ents,mem); mem=res.sel; var v=res.val;
    if(v===""||v==="quit")return;
    if(v==="disp"){ BGR=!BGR; applyColors(); saveCfg(); continue; }
    if(v==="theme")themeMenu(); else if(v==="search")searchFlow();
    else if(v==="browse")categoryMenu(); else if(v==="guide")guideHome();
    else if(v==="diag")diagnostic();
  }
}

main();
