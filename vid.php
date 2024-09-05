<?php
// php -S localhost:24712 vid.php
// http://localhost:24712/?url=https://www. face book .com/Mamb auna/videos/495745503 172467


header('Content-Type: application/json');

function fetchAsChrome($url) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');


    $headers = array();
    $headers[] = 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7';
    $headers[] = 'Accept-Language: en-US,en;q=0.9';
    $headers[] = 'Cache-Control: no-cache';
    $headers[] = 'Dpr: 1';
    $headers[] = 'Pragma: no-cache';
    $headers[] = 'Priority: u=0, i';
    $headers[] = 'Sec-Ch-Prefers-Color-Scheme: dark';
    $headers[] = 'Sec-Ch-Ua: \"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"';
    $headers[] = 'Sec-Ch-Ua-Full-Version-List: \"Chromium\";v=\"128.0.6613.115\", \"Not;A=Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"128.0.6613.115\"';
    $headers[] = 'Sec-Ch-Ua-Mobile: ?0';
    $headers[] = 'Sec-Ch-Ua-Model: \"\"';
    $headers[] = 'Sec-Ch-Ua-Platform: \"Windows\"';
    $headers[] = 'Sec-Ch-Ua-Platform-Version: \"15.0.0\"';
    $headers[] = 'Sec-Fetch-Dest: document';
    $headers[] = 'Sec-Fetch-Mode: navigate';
    $headers[] = 'Sec-Fetch-Site: none';
    $headers[] = 'Sec-Fetch-User: ?1';
    $headers[] = 'Upgrade-Insecure-Requests: 1';
    $headers[] = 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';
    $headers[] = 'Viewport-Width: 246';
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        echo 'Error:' . curl_error($ch);
    }else{
        return $result;
    }
    curl_close($ch);
    // fetch("https://co rs-any wh ere.hero kuapp.com/https://www. face book .com/Mamba una/videos/495745503 172467", {
    //     "headers": {
    //       "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    //       "accept-language": "en-US,en;q=0.9",
    //       "cache-control": "no-cache",
    //       "dpr": "1",
    //       "pragma": "no-cache",
    //       "priority": "u=0, i",
    //       "sec-ch-prefers-color-scheme": "dark",
    //       "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
    //       "sec-ch-ua-full-version-list": "\"Chromium\";v=\"128.0.6613.115\", \"Not;A=Brand\";v=\"24.0.0.0\", \"Google Chrome\";v=\"128.0.6613.115\"",
    //       "sec-ch-ua-mobile": "?0",
    //       "sec-ch-ua-model": "\"\"",
    //       "sec-ch-ua-platform": "\"Windows\"",
    //       "sec-ch-ua-platform-version": "\"15.0.0\"",
    //       "sec-fetch-dest": "document",
    //       "sec-fetch-mode": "navigate",
    //       "sec-fetch-site": "none",
    //       "sec-fetch-user": "?1",
    //       "upgrade-insecure-requests": "1",
    //       "viewport-width": "1058"
    //     },
    //     "referrerPolicy": "strict-origin-when-cross-origin",
    //     "body": null,
    //     "method": "GET",
    //     "mode": "cors",
    //     "credentials": "omit"
    //   });
}


function searchLine($html){
    $lines = explode("\n", $html);
    $output = [];
    
    foreach ($lines as $lineMP4) {
        if (strpos($lineMP4, 'audio\/mp4') !== false) {
            // $output['line_video'] = $lineMP4;
            $basUrls = extractBaseUrls($lineMP4);
            // $output['base_url'] = $basUrls;
            $output['audio'] = end($basUrls);
            $output['video_id'] = extractVideoId($lineMP4);
            $output['timestamp'] = extractTime($lineMP4);
            $output['duration_ms'] = extractDuration($lineMP4);
            $output['permalink'] = extractPermalink($lineMP4);
            $output['size_audio'] = bandwidthtoSize(extractBandwidthAudio($lineMP4), $output['duration_ms']);
            $output['duration'] = convertDuration($output['duration_ms']);
            $output['time'] = convertTimestampToDate($output['timestamp']);
            $output['mpd'] = 'https://www.face'.'book.com/video/playback/dash_mpd_debug.mpd?v='.$output['video_id'].'&dummy=.mpd';
            break;
        }
    }

    foreach ($lines as $lineDESC) {
        if (strpos($lineDESC, ',"text":"') !== false) {
            // $output['line_description'] = $lineDESC;
            $output['description'] = extractDescription($lineDESC);
            $output['title'] = extractTitle($lineDESC);
            $output['name'] = extractName($lineDESC);
            break;
        }
    }
    // $output['html'] = $html;
    return $output;
}

function extractBaseUrls($text) {
    $pattern = '/"base_url":"(.*?)",/';
    preg_match_all($pattern, $text, $matches);
    $urls = $matches[1];

    $decodedUrls = [];
    foreach ($urls as $url) {
        $url = stripslashes($url);
        $url = urldecode($url);
        $url = urldecode($url);

        $decodedUrls[] = $url;
    }

    return $decodedUrls;
}


function extractVideoId($text) {
    $awal = explode('"videoId":"', $text);
    $akhir = explode('","', $awal[1]);
    return $akhir[0];
}

function extractTime($text) {
    $awal = explode('"publish_time":', $text);
    $akhir = explode(',"', $awal[1]);
    return $akhir[0];
}

function extractDuration($text) {
    $awal = explode('"playable_duration_in_ms":', $text);
    $akhir = explode(',"', $awal[1]);
    return $akhir[0];
}

function extractPermalink($text) {
    $awal = explode('"permalink_url":"', $text);
    $akhir = explode('","', $awal[1]);
    return urldecode(stripslashes(stripslashes($akhir[0])));
}

function extractBandwidthAudio($text) {
    $pattern = '/"bandwidth":(\d+),/';
    preg_match_all($pattern, $text, $matches);
    $bandwidth = $matches[1];

    return end($bandwidth);
}

function bandwidthtoSize($bandwidth_kbps, $duration_ms){
    $duration_seconds = $duration_ms / 1000;
    $size_kilobytes = ($bandwidth_kbps * $duration_seconds) / 8 / 1024;
    $size_megabytes = $size_kilobytes / 1024;
    // echo "Ukuran file (perkiraan): " . round($size_kilobytes, 2) . " KB\n";
    return round($size_megabytes, 2) . " MB";
}

function convertDuration($milliseconds) {
    $seconds = $milliseconds / 1000;
    $hours = floor($seconds / 3600);
    $remainingSeconds = $seconds % 3600;
    $minutes = floor($remainingSeconds / 60);
    return "$hours jm, $minutes mnt";
}

function convertTimestampToDate($timestamp) {
    return gmdate("d/m/Y", $timestamp);
}

function extractDescription($text) {
    $awal = explode(',"text":"', $text);
    $akhir = explode('","', $awal[1]);

    $hasil = $akhir[0];
    $jsonText = '"' . $hasil . '"';
    $decodedText = json_decode($jsonText);
    
    return $decodedText;
}

function extractName($text) {
    $akhir = explode('","profile_picture":', $text);
    $awal = explode(',"name":"', $akhir[0]);
    $hasil = end($awal);
    $jsonText = '"' . $hasil . '"';
    $decodedText = json_decode($jsonText);
    
    return $decodedText;
}

function extractTitle($text) {
    $akhir = explode('"},"video_with_tagged_products"', $text);
    $awal = explode('"text":"', $akhir[0]);
    $hasil = end($awal);
    $jsonText = '"' . $hasil . '"';
    $decodedText = json_decode($jsonText);
    
    return $decodedText;
}



if(@$_GET['url'] == null){
    echo json_encode(array('status' => 'error', 'message' => 'url not found'));
    exit;
}

$html = fetchAsChrome($_GET['url']);
$data = searchLine($html);
$data['hit'] = 1;

if($data['description'] == null){
    $html = fetchAsChrome($_GET['url']);
    $data = searchLine($html);
    $data['hit'] = $data['hit']+1;
}


function extractVideoFromUrl($url) {
    $parsedUrl = parse_url($url, PHP_URL_PATH);
        preg_match('/\/videos\/(\d+)\//', $parsedUrl, $matches);
        return $matches[1] ?? null;
}

$idvideo = extractVideoFromUrl($_GET['url']);
$mpd = fetchAsChrome('https://www.face'.'book.com/video/playback/dash_mpd_debug.mpd?v='.$idvideo.'&dummy=.mpd');
$xml = simplexml_load_string($mpd) or die("Error: Cannot create object");
$audioMpd = $xml->Period->AdaptationSet[1]->Representation->BaseURL[0];

$data['audio_mpd'] = strval($audioMpd); // backup jika sewaktu2 ada update element dari fb

echo json_encode($data, TRUE);
?>
