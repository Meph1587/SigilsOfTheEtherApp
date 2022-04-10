import { useWeb3React } from "@web3-react/core";
import type { Web3Provider } from "@ethersproject/providers";
import Head from "next/head";
import Button from "../components/button";
import Account from "../components/Account";
import useEagerConnect from "../hooks/useEagerConnect";
import useGetSigils from "../hooks/useGetSigils";
import useGetNonce from "../hooks/useGetNonce";
import { useState } from "react";
import useSigilContract from "../hooks/useSigilContract";


export const sigilAddress = "0xb48e69f7cbf464ecd7fca11e129b764417876353";

export function cleanInput(i:string){
  let v = i.split("A").join("").split("E").join("").split("I").join("").split("O").join("").split("U").join("").split(" ").join("")

  return (Array.from(new Set(v.split(""))).reduce((b,c) => b+c, ""));
}


function Home() {
  const [input, setInput] = useState("");
  const [color, setColor] = useState("");
  const [mode, setMode] = useState(0);
  const [clean, setClean] = useState(true);
  const [preview, setPreview] = useState(true);
  const [casting, setCasting] = useState(false);
  const [hideOnce, setHideOnce] = useState(true);


  const { account, library } = useWeb3React<Web3Provider>();
  const triedToEagerConnect = useEagerConnect();

  const sigilContract = useSigilContract(sigilAddress);


  async function castSigil() {

    try {

      setHideOnce(false);

      const transaction = await sigilContract.cast(
      input?input : "FA94F",
      color?color:"red",
      mode,
    );
    console.log("input, color, mode",input, color, mode)

    setCasting(true)
    setPreview(true)

    await transaction.wait();


    setCasting(false)

    } catch (error) {
      console.log(error)
    }
  }

  const sigilImg =  useGetSigils(input !="" ? clean ? cleanInput(input): input : "FA94F", color?color:"red", sigilAddress);
  const nonce =  useGetNonce(sigilAddress);

  const isConnected = typeof account === "string" && !!library;

  const layout = {main: preview ? {"display":"inline"} : {"display":"inline-flex"} }
  

  return (
    <div style={{"backgroundColor":"black", "color":"white", "height":"100%", "overflow": "scroll"}}>
      <Head>
        <title>Sigils of the Ether</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div  style={{"marginTop": "-0.4em"}} >
          <nav>
            <Account triedToEagerConnect={triedToEagerConnect} />
            <div style={{"textAlign": "right", "padding":"20px"}}>
              <a 
                href={"https://rinkeby.etherscan.io/address/"+sigilAddress+"#readContract"} target="_blank"
              >
                <u>Contract on Etherscan</u>
              </a>
                <br/>
              <a 
                href={"https://testnets.opensea.io/collection/sigilsoftheether-v2"} target="_blank"
              >
                <u>Sigils on Opensea</u>
              </a>
              </div>
          </nav>
          <div>
            <h1 style={{"fontSize": "3.4em"}}>Sigils of the Ether</h1>
          </div>
          
          <div style={layout.main}>
            <div style={{"position":"relative","margin":"30px"}}>
              {preview ? 
                <div style={{"marginLeft":"80px", "marginRight":"80px", "textAlign":"center"}}>
                  {isConnected && (
                    <section>
                      <Button
                        onClick={() => setPreview(false)}
                      >
                      Make A Sigil
                      </Button>
                    </section>
                  )}
                </div>
                : 
                <div style={{"textAlign":"left"}}>
                  <div className="input-block">
                    <label style={{"fontSize":"14px"}}>Write your Intention</label><br/>
                    <input className="input-text" type="text" placeholder='MAY MY WORD BE MAGIC' value={input} onChange={(e) => setInput(e.target.value.toUpperCase())}/>
                  </div>
                  <div className="input-block">
                    <label style={{"fontSize":"14px"}}>Condense Input</label><br/>
                    <div style={{"display":"flex"}}>
                    <input type="checkbox" defaultChecked={clean} onChange={(e) => setClean(!clean)}/> 
                    <i style={{"marginTop":"1px","fontSize":"11px","color":"grey"}}>(remove vowels and duplicates)</i>
                    </div>
                  </div>
                  <div className="input-block">
                    <label style={{"fontSize":"14px"}}>Choose the Color</label><br/>
                    <input className="input-text" type="text" placeholder='red / #123456 / rgb(0,0,0)' value={color} onChange={(e) => setColor(e.target.value)}/>
                  </div>
                  <div className="input-block">
                    <label style={{"fontSize":"14px"}}>Select Casting Mode</label><br/>
                    <select className="input-text" name="mode" id="mode-select" onChange={(e) => setMode(parseInt(e.target.value))}>
                      <option value="0">Execute (cheap)</option>
                      <option value="1">Store (expensive)</option>
                      <option value="2">Mint (more expensive)</option>
                    </select> <br></br>
                      <i style={{"marginTop":"1px","fontSize":"11px","color":"grey", "wordBreak":"break-word"}}>
                      {mode == 0 ? "network nodes execute the sigil generation script - no data is stored in contract" : mode==1? "network nodes execute the sigil generation script - sigil is stored in contract storage" : "network nodes execute the sigil generation script - sigil is stored and also minted as NFT to your address"}
                      </i>
                  </div>
                
                  <div className="input-block" style={{"marginTop":"10px"}}>
                    {isConnected && (
                      <section>
                        <Button
                          onClick={castSigil}
                        >
                        Cast Sigil
                        </Button>
                      </section>
                    )}
                  </div>
                  
                  <div style={{"marginTop":"10px"}}>{input? 
                  <div>
                    Source Text: 
                    <p><b>
                    {clean ? cleanInput(input) : input}
                    </b></p>
                  </div> : ``}
                
                </div>
                </div>
              }
            </div>
            <div style={{"marginLeft":"80px", "marginRight":"80px"}}>
              <img width="500px" height="500px" src={sigilImg?.data} />
              {preview ? casting ? <p>Casting your Sigil ... </p>:'':''}
              {mode > 0 ? preview ? hideOnce ? '' : <p>Your Sigil Number: { casting ? nonce?.data?.toNumber() + 1 : nonce?.data?.toNumber()}</p> :'':''}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        nav {
          display: flex;
          justify-content: space-between;
        }

        main {
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default Home;
