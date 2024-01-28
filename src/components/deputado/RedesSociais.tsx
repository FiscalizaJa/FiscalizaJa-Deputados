import { Timeline } from "react-twitter-widgets";
import { MessageCircle, Heart, Instagram, Facebook, Youtube } from "lucide-react";
import Loading from "../Loading";
import "../../styles/deputados/redes_sociais.scss";
import { useState, useEffect } from "react";
import type { Deputado } from "../../interfaces/Deputado";

/* 
Aprendi com isso que a opção "do not track" do Twitter é só um enfeite, já que ele tá tentando rastrear mesmo com ela ativada.
*/

function getSocial(links: string[]) {
    const socials = {}

    for(const link of links) {
        const url = new URL(link)
        const domain = url.hostname.replace("www.", "")
        socials[domain] = url.pathname.replace(url.search, "").replace(/\//g, "")
    }

    return socials
}

export default function RedesSociais(props: { links: string[], deputado: Deputado }) {
    const social = getSocial(props.links)
    const twitter = social["twitter.com"]
    const instagram = social["instagram.com"]
    const facebook = social["facebook.com"]
    const youtube = social["youtube.com"]

    const [twitterLoading, setTwitterLoading] = useState(true)

    return (
        <>
            <p style={{ maxWidth: "880px", padding: "20px", margin: "auto", marginBottom: "1.1em" }}>As redes sociais são essenciais para conhecer a atuação de {props.deputado.siglaSexo === "M" ? "um deputado" : "uma deputada"} federal. Acompanhe o trabalho de <strong>@{props.deputado.nome}</strong> nas rede sociais!</p>
            <div className="socials">
                {
                    twitter &&
                    <div className="social">
                        <h2 style={twitterLoading ? { marginBottom: "-13px" } : {}}>Twitter</h2>
                        <Timeline 
                            dataSource={{
                                sourceType: "profile",
                                screenName: twitter,
                            }}
                            options={{
                                theme: "dark",
                                height: 400,
                                dnt: true,
                                tweetlimit: 5
                            }}
                            onLoad={() => { setTwitterLoading(false) }}
                        />
                        <br />
                        {
                            twitterLoading && <TwitterSkeleton username={twitter} />
                        }
                    </div>
                }

                <div className="socials">
                    <OtherSocial facebook={facebook || null} instagram={instagram || null} youtube={youtube || null} />
                </div>
            </div>
        </>
    )
}

function TwitterSkeleton(props: { username: string }) {
    return (
        <>
            <div className="twitter-skeleton">
                <div className="header">
                    <h3 color="rgb(231, 233, 234)">Tweets from <strong>@{props.username}</strong></h3>
                </div>
                <div className="post-container">
                    <div className="photo" />
                    <div style={{ width: "90%" }}>
                        <div className="post-author">
                            <div className="text" style={{ marginTop: "6px", width: "40%" }} />
                            <div className="text" style={{ marginTop: "6px", width: "10%" }} />
                            <div className="text" style={{ marginTop: "6px", width: "25%" }} />
                        </div>
                        <div className="text" style={{ marginTop: "14px", width: "100%" }} />
                        <div className="text" style={{ marginTop: "8px", width: "60%" }} />
                        <div className="image" />
                        <div className="buttons">
                            <p><MessageCircle size="1.35em" /></p> <p>12K</p>
                            <p><Heart size="1.35em" /></p> <p>3K</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

function OtherSocial(props: { instagram: string, facebook: string, youtube: string }) {
    return (
        <>
            <div className="others">
                <h2>Outras redes</h2>
                { props.youtube && <p><a href={`https://youtube.com/channel/${props.instagram}`} target="_blank" style={{ fontSize: "1.1em" }}><Youtube style={{ transform: "translateY(5px)" }}/> Youtube @{props.youtube}</a></p> }
                { props.instagram && <p><a href={`https://instagram.com/${props.instagram}`} target="_blank" style={{ fontSize: "1.1em" }}><Instagram style={{ transform: "translateY(5px)" }}/> Instagram @{props.instagram}</a></p> }
                { props.facebook && <p><a href={`https://facebook.com/${props.facebook}`} target="_blank" style={{ fontSize: "1.1em" }}><Facebook style={{ transform: "translateY(5px)" }}/> Facebook @{props.facebook.replace(/[0-9]/g, "")}</a></p> }
                { !props.youtube && !props.instagram && !props.facebook && <p>Nenhuma rede social informada, que pena...</p> }
            </div>
        </>
    )
}