import nextBase64 from 'next-base64';
import prismNews from '@/configs/prismNews.json';
import addUser from "@/lib/addUser";
import {NextRequest, userAgent} from "next/server";

export const dynamic = "force-dynamic";

// sorry i don't wanna use another library to generate fucking feed.xml file for launcher
// and i really hate .xml files so i didn't bother with the quality of my code
export async function GET(request: NextRequest) {
    const useragent = userAgent(request).ua;

    const githubContents = await fetch("https://api.github.com/repos/freesmteam/news/contents/feed.md");

    if (!githubContents.ok) {
        return new Response(
            prismNews.beforeContent + prismNews.afterContent,
            {
                status: 429,
            }
        );
    }

    const news = await githubContents.text();
    const parsedNews = JSON.parse(news);
    const decodedNews = nextBase64.decode(parsedNews?.content);
    const decodedNewsArr = decodedNews.split('---');
    const decodedNewsProperties = decodedNewsArr.map((entry) => {
        const properties = entry
            .split('\n')
            .filter((line) => line !== '');

        return {
            title: properties[0],
            link: properties[1],
            id: properties[1],
            date: properties[2],
            content: properties.slice(3).join('\n ').replaceAll('<', "&lt;"),
        };
    });

    const xmlNews = decodedNewsProperties.map((entry) => {
        return (
            `
                <entry>
                    <title>${entry.title}</title>
                    <link href="${entry.link}" />
                    <updated>${entry.date}</updated>
                    <id>${entry.id}</id>
                    <content type="html">
                        ${entry.content}
                    </content>
                </entry>
            `
        );
    }).join('');

    const response = new Response(
        prismNews.beforeContent + xmlNews + prismNews.afterContent,
        {
            status: 200,
            statusText: "ok",
        }
    );

    response.headers.append("content-type", "text/xml");

    // don't wait for database response, just return xml
    // in case it fails we don't really care
    addUser({
        useragent,
    }).catch((err) => {
        console.error(err.message);
    });

    return response;
}