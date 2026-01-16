import Footer from "@/shared/components/Footer";
import { FooterList, type FooterListModel } from "./FooterList";

const products: FooterListModel = {
  title: "Prodotti",
  links: ["RC Auto", "RC Moto", "RC Furgone", "Garanzie Accessorie"],
};

const enterprise: FooterListModel = {
  title: "Azienda",
  links: ["Chi Siamo", "Come Funziona", "Blog", "Lavora con Noi"],
};

const support: FooterListModel = {
  title: "Supporto",
  links: ["FAQ", "Contatti", "Area Clienti", "Denuncia Sinistri"],
};

export function HomeFooter() {
  return (
    <Footer>
      <div>
        <FooterList {...products} />
      </div>
      <div>
        <FooterList {...enterprise} />
      </div>
      <div>
        <FooterList {...support} />
      </div>
    </Footer>
  );
}
