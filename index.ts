import { readFileSync } from "fs";
import fetch from "node-fetch"






const raw = readFileSync("./tran.txt", "utf8")

const data = JSON.parse(raw)

const actions = data.actions

function traverse(node:any, results:string[] = []){
		
			
		if (node == "" || node== undefined){
				return results
		}

		if (typeof node == "object" && "text" in node && typeof node.text == "string"){
				
				results.push(node.text)

		}
		if (Array.isArray(node)){
				
				for (const elements of  node){
						traverse(elements, results)	
				}
				return results

		}
		if (typeof node == "object"){
				
				for (const key of Object.keys(node)){
						traverse(node[key], results)
				}
		}

		return results

}
	



async function getTranscript(videoId: string,params: string | undefined) {
  const payload = {
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20241113.01.00"
      }
    },
    externalVideoId: videoId,
	params: params
  };

  const res = await fetch(
    "https://www.youtube.com/youtubei/v1/get_transcript?key=YOUR_API_KEY",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
        "X-Origin": "https://www.youtube.com",
        "X-Youtube-Client-Name": "1",
        "X-Youtube-Client-Version": "2.20241113.01.00"
      },
      body: JSON.stringify(payload)
    }
  );

  return await res.json();

  
}




function getVideoID(url: string){
		
		const length_vidID: number = 11
		return url.split("v=")[1].substring(0, length_vidID)


}




async function htmlpage(videoId: string){
		
		const html = await fetch(`https://www.youtube.com/watch?v=${videoId}`).then(r =>r.text())

		

		return html	


}


function get_TranscriptParams(HTMLtxt: string){

		const match = HTMLtxt.match(/"getTranscriptEndpoint":\{"params":"([^"]+)"/)
		
		if (match) {
		    const transcriptParam = match[1];
				return transcriptParam;
		} else {
				console.log("No transcript param found");
}


}


(async () => {
		const videoId = getVideoID("https://www.youtube.com/watch?v=sJBaMJfxzYk");

		const html = await htmlpage("sJBaMJfxzYk")
		
		const params = get_TranscriptParams(html)
		const transcript = await getTranscript(videoId,params) ;


		console.log(JSON.stringify(transcript, null, 2));
})();
