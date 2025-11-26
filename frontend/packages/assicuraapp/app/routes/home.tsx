import type { Route } from "./+types/home";
import { getLogger } from "~/shared/util/logger";

export function meta({ }: Route.MetaArgs) {
  let log = getLogger();
  log.info("Ciao come va",{ciao: 1});
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
 ];
}

export default function Home() {
  return <p>Ciao come va</p>;
}
