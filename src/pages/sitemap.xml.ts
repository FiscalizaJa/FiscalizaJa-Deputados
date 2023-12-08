import type { APIContext } from "astro"

let deputadosLista
let dataAtual = new Date().toISOString()

setInterval(async () => {
    const request = await fetch(`${import.meta.env.PUBLIC_API_URL}/deputados`)

    if(request.ok) {
        deputadosLista = await request.json()
        deputadosLista = deputadosLista.data
    } else {
        console.log("FAILED TO UPDATE DEPUTIES ON SITEMAP (will try again in 32 hours)")
    }

    dataAtual = new Date().toISOString()
}, 115200000)



export async function GET() {
    if(!deputadosLista) {
        const request = await fetch(`${import.meta.env.PUBLIC_API_URL}/deputados`)

        deputadosLista = await request.json()
        deputadosLista = deputadosLista.data
    }

    return new Response(`
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
            <url>
                <loc>https://deputados.fiscalizaja.com</loc>
            </url>
            <url>
                <loc>https://deputados.fiscalizaja.com/deputados</loc>
            </url>
            ${deputadosLista.map((deputado) => {
                return `
                    <url>
                        <loc>https://deputados.fiscalizaja.com/deputados/${deputado.idCamara}</loc>
                        <lastmod>${dataAtual}</lastmod>
                        <changefreq>daily</changefreq>
                    </url>
                `
            })}
        </urlset>
    `, {
        headers: {
            'Content-Type': "application/xml"
        }
    })
}