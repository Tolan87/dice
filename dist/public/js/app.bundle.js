(()=>{var e={283:()=>{let e=document.getElementById("btn-start"),t=document.getElementById("btn-stake"),n=document.getElementById("btn-end"),a=document.getElementById("btn-new"),s=document.querySelector(".new-game"),r=document.getElementById("money"),i=document.getElementById("stake"),d=document.getElementById("sound");function l(){let e=new XMLHttpRequest;e.onload=function(){let t=JSON.parse(e.responseText);if(4==e.readyState&&200==e.status){console.log(t),t.player_values.length>=3&&n.removeAttribute("disabled"),u("player-result",t.player_values);let e=[];t.player_values.forEach((t=>{e.push("0")})),u("tavern-result",e,500)}else 4==e.readyState&&400==e.status&&o()},e.open("POST","dice.php",!0),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send("action=dice_roll")}function o(){let a=new XMLHttpRequest;a.onload=function(){let d=JSON.parse(a.responseText);if(4==a.readyState&&200==a.status){switch(u("player-result",d.player_values),u("tavern-result",d.tavern_values),d.won){case 0:p("./audio/game_over.mp3"),c("Es tut uns leid :-(<br /><br />Du hast leider verloren");break;case 1:p("./audio/won.mp3"),c("Juppppiiiieee!!!<br /><br />Du hast gewonnen :-)");break;case 2:p("./audio/game_over.mp3"),c("Sei nicht traurig...<br /><br />Bei einem unentschieden verliert man schließlich auch sein Einsatz nicht ;-)")}r.innerHTML=d.money,i.value=null,i.setAttribute("disabled",""),t.setAttribute("disabled",""),e.setAttribute("disabled",""),n.setAttribute("disabled",""),s.style.display="block"}else 4==a.readyState&&400==a.status&&(d.message&&d.message.length>0&&c(d.message),e.removeAttribute("disabled"),n.setAttribute("disabled",""))},a.open("POST","dice.php",!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send("action=dice_end")}function u(e,t,n=0){let a=document.getElementById(e);setTimeout((()=>{a.querySelectorAll("li").forEach((e=>{e.remove()}));for(let e=0;e<t.length;e++){let n=document.createElement("li"),s=document.createElement("img");s.setAttribute("height","30"),s.setAttribute("width","30"),s.setAttribute("src","./img/dice_"+t[e]+".png"),n.appendChild(s),a.appendChild(n)}}),n)}function c(e,t=5e3){let n=document.getElementById("notifications"),a=document.createElement("div");a.style.opacity=1,a.setAttribute("class","card notification");let s=document.createElement("div");s.setAttribute("class","card-header notification-header"),s.innerHTML="Meldung";let r=document.createElement("div");r.setAttribute("class","card-body notification-body"),r.innerHTML=e,a.appendChild(s),a.appendChild(r),n.appendChild(a);let i=a.style.opacity;setTimeout((()=>{let e=setInterval((()=>{i-=.075,a.style.opacity=i,i<=0&&(a.remove(),clearInterval(e))}),50)}),t)}function p(e){d.setAttribute("src",e),d.play()}window.addEventListener("load",(()=>{!function(){let e=new XMLHttpRequest;e.onload=function(){4==e.readyState&&200==e.status&&(r.innerHTML=JSON.parse(e.responseText).money)},e.open("POST","dice.php",!0),e.setRequestHeader("Content-type","application/x-www-form-urlencoded"),e.send("action=get_player_money")}()})),i.addEventListener("input",(()=>{!isNaN(i.value)&&i.value>0?t.removeAttribute("disabled"):t.setAttribute("disabled","")})),t.addEventListener("click",(()=>{!function(n){let a=new XMLHttpRequest;a.onload=function(){let n=JSON.parse(a.responseText);4==a.readyState&&200==a.status?(n.message&&n.message.length>0&&c(n.message),isNaN(n.money)||(r.innerHTML=n.money),t.setAttribute("disabled",""),e.removeAttribute("disabled")):4==a.readyState&&400==a.status&&(n.message&&n.message.length>0&&c(n.message),t.removeAttribute("disabled"),e.setAttribute("disabled",""))},a.open("POST","dice.php",!0),a.setRequestHeader("Content-type","application/x-www-form-urlencoded"),a.send("action=dice_start&stake="+n)}(i.value)})),e.addEventListener("click",(()=>{p("./audio/dice.mp3"),l()})),e.addEventListener("touchend",(e=>{p("./audio/dice.mp3"),l(),e.preventDefault()})),n.addEventListener("click",(()=>{o()})),a.addEventListener("click",(()=>{document.getElementById("player-result").querySelectorAll("li").forEach(((e,t)=>{setTimeout((()=>{e.remove()}),250+250*t)})),document.getElementById("tavern-result").querySelectorAll("li").forEach(((e,t)=>{setTimeout((()=>{e.remove()}),250+250*t)})),s.style.display="none",i.removeAttribute("disabled")}))}},t={};function n(a){if(t[a])return t[a].exports;var s=t[a]={exports:{}};return e[a](s,s.exports,n),s.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";n(283)})()})();