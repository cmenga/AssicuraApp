import type { FooterListModel } from "./type";


export function FooterList(props: FooterListModel) {
    const { links, title } = props;

    return (
        <>
            <h4 className="font-semibold mb-4">{title}</h4>
            <ul className="space-y-2 text-gray-400">
                {links.map((link, index) => <li key={index}><a href="#" className="hover:text-white transition">{link}</a></li>)}
            </ul>
        </>
    );
}