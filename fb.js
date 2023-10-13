  // config
  var scrollValue = 50; // change to controll speed scroll



  
  // declaration variable
   var laporan = [];
   var listening = false;
   var otoScroll = false;

   // amankan leave site
    window.addEventListener('beforeunload', (event) => { 
        event.preventDefault();
        event.returnValue = '';
    });

   // start intercept
               // Simpan referensi ke fungsi asli
               var originalXhrOpen = XMLHttpRequest.prototype.open;

               // Timpa fungsi open untuk merekam permintaan
               XMLHttpRequest.prototype.open = function(method, url) {
                   this._url = url;
                   this._method = method;
                   return originalXhrOpen.apply(this, arguments);
               };

               // Intercept respons dan simpan dalam kumpulan
               var xhrResponsesCatch = [];
                //    var xhrResponsesCatch_graphql = [];

               // Timpa fungsi send untuk merekam respons
               var originalXhrSend = XMLHttpRequest.prototype.send;
               XMLHttpRequest.prototype.send = function() {
                   var xhr = this;
                   var xhrIndex = xhrResponsesCatch.length;
                   
                   xhr.onload = function() {
                       var endTime = performance.now();
                       var duration = endTime - xhr._startTime;
                       xhrResponsesCatch[xhrIndex] = {
                           url: xhr._url,
                           method: xhr._method,
                           status: xhr.status,
                           responseText: xhr.responseText,
                           duration: duration
                       };

                       if(xhr._url == "/api/graphql/"){
                        //    xhrResponsesCatch_graphql.push(xhr);
                           // analisaAsli(xhr.responseText);
                           // analisaTambahan(xhr.responseText);
                           analisaDescription(xhr.responseText);
                       }
                   };

                   xhr._startTime = performance.now();
                   return originalXhrSend.apply(this, arguments);
               };

function cariId(arrayOfArrays, valueToFind) {
for (var i = 0; i < arrayOfArrays.length; i++) {
   if (arrayOfArrays[i][1] === valueToFind) {
       return i; // Mengembalikan indeks jika nilai ditemukan
   }
}
return -1; // Mengembalikan -1 jika nilai tidak ditemukan
// cariId(laporan, "83356000478");
}


function cariString(arr, stringCari) {
var hasilPencarian = [];

for (var i = 0; i < arr.length; i++) {
 if (arr[i].includes(stringCari)) {
   hasilPencarian.push(i); // Menambahkan indeks ke array hasil
 }
}

return hasilPencarian;
}



function formatWaktu(timestamp, arrout) {
    const date = new Date(timestamp * 1000); // Kali 1000 karena timestamp dalam detik, bukan milidetik
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    if(arrout==true){
        return [formattedDay, formattedMonth, year];
    }else{
        return `${formattedDay}/${formattedMonth}/${year}`;
    }
}


function formatMenit(milliseconds) {
    if(Number.isInteger(milliseconds)){
    let totalSeconds = Math.floor(milliseconds / 1000); // Mengubah ms menjadi detik
    let minutes = Math.floor(totalSeconds / 60); // Menghitung menit
    let seconds = totalSeconds % 60; // Menghitung detik
    return `${minutes}:${seconds}`;
    }else{
    return "-";
    }


    //   let msValue = 1777536;
    //   let timeString = msToTime(msValue);
    //   console.log(timeString); // Output: "29:38"
}



function analisaDescription(w){
try{
   var text = w;
   var lines = text.split('\n');
   var responseVid;
   if(lines.length > 8){ // == 10

       var cari = cariString(lines, 'wwwURL');
    //    console.log(cari);

    //    var cari2 = cariString(lines, '||');
    //    console.log(cari2);


       for(var iq=0; iq<cari.length; iq++){
           analisaLine(lines[cari[iq]], cari[iq]);
       }
   }


}catch(err){
   console.log(err);
}
}



function analisaLine(w, g){
//console.log(">>>>>>>>>>>>>>>>>>>> new proses");

setTimeout(() => {
    warnai();
}, 5000);

var responseVid = JSON.parse(w);
// console.log(g);
// console.log(responseVid);

try {
   if(responseVid.data.node.timeline_list_feed_units !== undefined && responseVid.data.node.timeline_list_feed_units.edges[0].node.comet_sections.content.story.attachments[0].styles.attachment.media.playable_duration_in_ms !== undefined){ // asli
       var desc = responseVid.data.node.timeline_list_feed_units.edges[0].node.comet_sections.content.story.message.text;
       var urlid = responseVid.data.node.timeline_list_feed_units.edges[0].node.comet_sections.content.story.wwwURL;
       var idvid = urlid.split("/")[5];
       var dateVid = responseVid.data.node.timeline_list_feed_units.edges[0].node.comet_sections.content.story.comet_sections.context_layout.story.comet_sections.metadata[0].story.creation_time;
       var durasi = responseVid.data.node.timeline_list_feed_units.edges[0].node.comet_sections.content.story.attachments[0].styles.attachment.media.playable_duration_in_ms;
    //    console.log(desc);
    //    console.log(idvid);
       console.log(urlid);

    //    console.log(formatWaktu(dateVid));
    //    console.log(formatMenit(durasi));

    if(listening == false){
        alert("listening disabled");
    }

       if(formatWaktu(dateVid).includes(listening) && formatMenit(durasi) !== "-"){
            //console.log(">>>>>>>>>>>>>>>>>>>> new proses asli");
            laporan.push([formatWaktu(dateVid), idvid, formatMenit(durasi), desc, urlid]); // push
            setTimeout(() => {
                warnai();
                exportToTable()
            }, 5000);
       }else{
            stopScroll();
            console.log("non video or changed month. You can press START SCROLL again if the month hasn't changed");
        }

       try {
        //    console.log(responseVid.data.node.timeline_list_feed_units.edges[0].node.comet_sections.content.story.attachments[0].comet_footer_renderer.attachment.ghl_mocked_footer_info.headline);
       } catch (error) {
        //    console.log("headline : -");
       }
   }else{ // tambahan
       // console.log(responseVid.data.node.comet_sections.content.story.comet_sections.message.story.message.text);
       var desc = responseVid.data.node.comet_sections.content.story.message.text;
       var urlid = responseVid.data.node.comet_sections.content.story.wwwURL;
       var idvid = urlid.split("/")[5];
       var dateVid = responseVid.data.node.comet_sections.content.story.comet_sections.context_layout.story.comet_sections.metadata[0].story.creation_time;
       var durasi = responseVid.data.node.comet_sections.content.story.attachments[0].styles.attachment.media.playable_duration_in_ms;
    //    console.log(desc);
    //    console.log(idvid);
       console.log(urlid);

    //    console.log(formatWaktu(dateVid));
    //    console.log(formatMenit(durasi));

    if(listening == false){
        alert("listening disabled");
    }

    if(formatWaktu(dateVid).includes(listening) && formatMenit(durasi) !== "-"){
            //console.log(">>>>>>>>>>>>>>>>>>>> new proses asli");
            laporan.push([formatWaktu(dateVid), idvid, formatMenit(durasi), desc, urlid]); // push
            setTimeout(() => {
                warnai();
                exportToTable()
            }, 5000);
        }else{
            stopScroll();
            console.log("non video or changed month. You can press START SCROLL again if the month hasn't changed");
        }

       try {
        //    console.log(responseVid.data.node.comet_sections.content.story.attachments[0].comet_footer_renderer.attachment.ghl_mocked_footer_info.headline);
       } catch (error) {
        //    console.log("headline : -");
       }
   }
} catch (error) {
   console.log(error);
}
}


function formatDateToCustomString(date) {
const day = String(date.getDate()).padStart(2, '0');
const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0, jadi tambahkan 1
const year = date.getFullYear();
const hours = String(date.getHours()).padStart(2, '0');
const minutes = String(date.getMinutes()).padStart(2, '0');

return `${hours}-${minutes}_${day}-${month}-${year}`;
// formatDateToCustomString(new Date());
}


function warnai(){
    try {
        for(var i=0; i<laporan.length; i++){
            var element = document.querySelector(`a[href*="/videos/${laporan[i][1]}"]`).parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            // if (element) {
                element.style.backgroundColor = '#00808052';
            // }
        }
    } catch (error) {
        // console.log(error);
    }
}


function startx(){
    // show ui
    document.body.insertAdjacentHTML('beforeend',
    `
        <div fz="popup">
        <div fz="bungkus">
            <div fz="kotak">
                <div fz="konten">
                    <h1 style="font-size: 2rem;text-align: center;">FACEBOOK LIVE SCRAPING DATA</h1>
                    <p style=" text-align: center; margin: 0; ">@milio48 <br> v - [13/10/2023]</p>
                    <div fz="target-listen">
                        <select id="tahun" style="font-size: large;">
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                        </select>
                        <select id="bulan" style="font-size: large;">
                            <option value="01">Januari</option>
                            <option value="02">Februari</option>
                            <option value="03">Maret</option>
                            <option value="04">April</option>
                            <option value="05">Mei</option>
                            <option value="06">Juni</option>
                            <option value="07">Juli</option>
                            <option value="08">Agustus</option>
                            <option value="09">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </select>
                        <button style="background-color: #4CAF50;color: white;border: none;padding: 10px 20px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;border-radius: 8px;" fz="btn-listen">Listen</button>
                    </div>
                    <div fz="konten-table">
                        <table border="1" fz="table">
                            <tbody fz="tbody">
                                <tr>
                                    <th>Play</th>
                                    <th>No</th>
                                    <th>Tanggal</th>
                                    <th>Video ID</th>
                                    <th>Durasi</th>
                                    <th>Hashtag</th>
                                    <th>Description</th>
                                    <th>Link</th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div fz="tombol"> 
                        <button style="background-color: #4c94af;" fz="btn-htg">GET HASHTAG</button>
                        <button style="background-color: #4CAF50;" fz="btn-start">Start Scroll</button>
                        <button style="background-color: #af4c72;" fz="btn-stop">Stop Scroll</button>
                        <button style="background-color: #afa84c;" fz="btn-dnlnd">Download JSON</button>
                        <button style="background-color: #86867a;" fz="btn-reset">Reset Table</button>
                    </div>
                    <div fz="hashtag">
                        <h3 style=" margin-top: 6px; ">Unique Hashtag as a Category</h3>
                        <textarea fz="txt_hashtag" spellcheck="false" rows="2" cols="70" style=" width: 100%; resize: none; color: #2f2faa; ">#myVid #reupload</textarea>
                    </div>
            </div>
        </div>
    </div>
    <button fz="btn48">🤖 FACEBOOK LIVE SCRAPING DATA 🤖</button>
    `);
    document.querySelectorAll('[fz="txt_hashtag"]')[0].value = sessionStorage.getItem("fz_hashtag") || "#myvideo #reupload";
    // benerin responsive gan <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    // Buat elemen style
    var styleFz = document.createElement("style");

    // Tambahkan aturan CSS
    styleFz.innerHTML = `
                        [fz="popup"]{
                            bottom: 0;width: 100%;height: 100%;background-color: #e70e0e0d;
                        }
                    
                        [fz="bungkus"]{
                            display: flex;justify-content: center;align-items: center;min-height: 100vh;
                        }
                        
                        [fz="kotak"]{
                            background: #ffffffcc; width: 80%; height: 550px; border: solid; padding: 50px; overflow: auto; padding-top: 10px; 
                        }
                    
                        [fz="konten-table"]{
                            overflow: auto; max-height: 300px; height: 300px; margin-top: 30px; border: solid #00000026 1px; margin-bottom: 30px; padding: 3px; 
                        }
                    
                        [fz="table"]{
                            border-collapse: collapse;width: 100%;overflow: scroll;max-height: 100px;
                        }
                    
                        [fz="tbody"] td{
                            overflow: hidden; max-width: 100px; text-overflow: ellipsis; white-space: nowrap; 
                        }

                        [fz="tombol"] button{
                            color: white;border: none;padding: 10px 20px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;border-radius: 8px;
                        }

                        [fz="target-listen"]{
                            text-align: center; margin-top:20px;
                        }

                        [fz="btn48"] {
                            position: fixed;top: 20%;right: 20px;background-color: #007bff;color: #fff;padding: 10px 20px;border: none;border-radius: 5px;cursor: pointer;z-index: 3;box-shadow: 2px 3px 20px 1px rgb(0 0 0);;
                        }

                        [fz="btn48"]:hover {
                        background-color: #0056b3;
                        }
    `;
    

    // Masukkan elemen style ke dalam head dokumen
    document.head.appendChild(styleFz);

    // show popup
    setTimeout(() => {
        document.querySelector('[fz="popup"]').style.position = 'fixed';
    }, 2000);
}




// 0   1   2      3
// tgl id durasi desc

function tulisData(w){
    var fzTbody = document.querySelector(`[fz="tbody"]`);
                                                                                                                                                                                                                                                                                                                                                    
    var tr = `
                <tr>
                    <td style="text-align:center;"><a href="${w[4]}" style="color:blue;cursor:pointer;" target="_blank">Play</a></td>
                    <td>${document.querySelectorAll(`[fz="tbody"] tr`).length}</td>
                    <td>${w[0]}</td>
                    <td>${w[1]}</td>
                    <td>${w[2]}</td>
                    <td>-</td>
                    <td>${newline(w[3])}</td> 
                    <td>${w[4]}</td>
                </tr>`;
    fzTbody.insertAdjacentHTML('beforeend', tr);
  }




  function exportToTable(){
    var lastTr = document.querySelector(`[fz="konten-table"]`).querySelectorAll('tr').length-1;
    for(var i=lastTr; i<laporan.length; i++){
        if(cariId(laporan, laporan[i][1] !== true)){
            tulisData(laporan[i]);
        }
    }

    setTimeout(() => {
        getHashtag()
    }, 3000);
  }



  function cariId(arrayOfArrays, valueToFind) {
    for (var i = 0; i < arrayOfArrays.length; i++) {
        if (arrayOfArrays[i][1] === valueToFind) {
            return i; // Mengembalikan indeks jika nilai ditemukan
        }
    }
    return -1; // Mengembalikan -1 jika nilai tidak ditemukan
    // cariId(laporan, "83356000478");
}



function listen(){
    document.documentElement.scrollTop = 0;
    startScroll(scrollValue);
    
    var bulan = document.querySelector(`#bulan`).value;
    var tahun = document.querySelector(`#tahun`).value;
    
    if(tahun == '2023'){var thnw = 1}
    if(tahun == '2022'){var thnw = 2}
    if(tahun == '2021'){var thnw = 3}
    if(tahun == '2020'){var thnw = 4}
    if(tahun == '2019'){var thnw = 5}

    if(bulan == '01'){var blnw = 1}
    if(bulan == '02'){var blnw = 2}
    if(bulan == '03'){var blnw = 3}
    if(bulan == '04'){var blnw = 4}
    if(bulan == '05'){var blnw = 5}
    if(bulan == '06'){var blnw = 6}
    if(bulan == '07'){var blnw = 7}
    if(bulan == '08'){var blnw = 8}
    if(bulan == '09'){var blnw = 9}
    if(bulan == '10'){var blnw = 10}
    if(bulan == '11'){var blnw = 11}
    if(bulan == '12'){var blnw = 12}

    listening = `${bulan}/${tahun}`;

    
    setTimeout(() => {
        document.querySelectorAll('[aria-label="Filter"]')[0].click();
        console.log("%cklik filter", "color:blue");
    }, 1000);


    setTimeout(() => {
        document.querySelectorAll('[aria-haspopup="listbox"]')[0].click();
        console.log("%cklik tahun", "color:blue");
    }, 2000);

    setTimeout(() => {
        var lastxx = document.querySelectorAll('[aria-selected="true"]').length-1;
        document.querySelectorAll('[aria-selected="true"]')[lastxx].parentElement.querySelectorAll('[aria-selected]')[thnw].click();
        console.log("%cpilih tahun", "color:blue");
    }, 3000);



    setTimeout(() => {
        document.querySelectorAll('[aria-haspopup="listbox"]')[1].click();
        console.log("%cklik bulan", "color:blue");
    }, 4000);

    setTimeout(() => {
        var lastxx = document.querySelectorAll('[aria-selected="true"]').length-1;
        document.querySelectorAll('[aria-selected="true"]')[lastxx].parentElement.querySelectorAll('[aria-selected]')[blnw].click(); // maret
        console.log("%cpilih bulan", "color:blue");
    }, 5000);


    setTimeout(() => {
        document.querySelectorAll('[aria-label="Selesai"]')[1].click();
        console.log("%ckirim filter","color: blue; font-size: 20px");
    }, 6000);

    setTimeout(() => {
        // alert('listenening on. please scroll.');
    }, 10000);
}


setTimeout(() => {
    startx()
}, 3000);


function startScroll(scrollSpeed = 10, interval = 20) {
    if(otoScroll == false){
        scrollInterval = setInterval(() => {
        window.scrollBy(0, scrollSpeed);
        }, interval);
        otoScroll = true;
        console.log("%cStart Scroll", "color:green");
    }
  }

  function stopScroll() {
    if(otoScroll == true){
        clearInterval(scrollInterval);
        console.log("%cStop Scroll", "color:red");
        otoScroll = false;
    }
  }



function getHashtag(){
    var hashtag_input = document.querySelector('[fz="txt_hashtag"]').value;
    var arr_hashtag = hashtag_input.split(" ");

    for(var i=0; i<laporan.length; i++){
        for(var o=0; o<arr_hashtag.length; o++){
            if (laporan[i][3].includes(arr_hashtag[o])) {
                document.querySelectorAll(`[fz="tbody"] tr`)[i+1].querySelectorAll("td")[5].innerHTML = arr_hashtag[o];
            }
        }
    }
}


function dnldjson(){
    var jsonOutput = JSON.stringify(laporan);
    var skrg = formatDateToCustomString(new Date());

    downloadJson(jsonOutput, `output_(${listening})_${skrg}.json`, 'application/json');
    console.log("%cDownload Json","color: orange; font-size: 20px");
  }
  

  
function downloadJson(data, filename, type) {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }


  function newline(w) {
    return w.replace(/\n/g, '\\n');
  }


  function bukatutup() {
    if(document.querySelector('[fz="popup"]').style.position == 'fixed'){
        document.querySelector('[fz="popup"]').style.position = 'unset';
        console.log("%chide ui", "color:aqua");
    }else{
        document.querySelector('[fz="popup"]').style.position = 'fixed';
        console.log("%cshow ui", "color:aqua");
    }
  }

  function resetTable(){
    if (confirm("Reset Table?") == true) {
        document.querySelector('[fz="tbody"]').innerHTML = `<tr> <th>Play</th> <th>No</th> <th>Tanggal</th> <th>Video ID</th> <th>Durasi</th> <th>Hashtag</th> <th>Description</th> <th>Link</th></tr>`;
        laporan = [];
        console.log("%cReset Table","color: orange; font-size: 20px");
    }
  }



setTimeout(() => {
    // event
  document.querySelector('[fz="btn48"]').addEventListener('click', function() {
    bukatutup(); 
  });

  document.querySelector('[fz="btn-listen"]').addEventListener('click', function() {
    listen();
  });

  document.querySelector('[fz="btn-htg"]').addEventListener('click', function() {
    getHashtag();
  });

  document.querySelector('[fz="btn-start"]').addEventListener('click', function() {
    startScroll(scrollValue);
  });

  document.querySelector('[fz="btn-stop"]').addEventListener('click', function() {
    stopScroll();
  });

  document.querySelector('[fz="btn-dnlnd"]').addEventListener('click', function() {
    dnldjson();
  });

  document.querySelector('[fz="btn-reset"]').addEventListener('click', function() {
    resetTable();
  });

  document.querySelector('[fz="txt_hashtag"]').addEventListener('change', function() {
    sessionStorage.setItem('fz_hashtag', this.value)
  });
}, 5000);
