import { Footer } from "./Footer";
import { FooterList } from "./FooterList";
import type { FooterListModel } from "./type";


const products: FooterListModel = {
    title: "Prodotti",
    links: ["RC Auto", "RC Moto", "RC Furgone", "Garanzie Accessorie"]
};

const enterprise: FooterListModel = {
    title: "Azienda",
    links: ["Chi Siamo", "Come Funziona", "Blog", "Lavora con Noi"]
};

const support: FooterListModel = {
    title: "Supporto",
    links: ["FAQ", "Contatti", "Area Clienti", "Denuncia Sinistri"]
};


export function HomeFooter() {

    return (
        <Footer>
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                    <FooterList {...products} />
                </div>
                <div>
                    <FooterList {...enterprise} />
                </div>
                <div>
                    <FooterList {...support} />
                </div>
            </div>
        </Footer>
    );
}