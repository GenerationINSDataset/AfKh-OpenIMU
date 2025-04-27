import "./App.css";
import IMUForm from "./components/IMUForm";
import { IntlProvider } from "react-intl";
import locales from "./i18n.ts";

function App() {
  const { fr } = locales;

  return (
    <IntlProvider locale={fr.locale} messages={fr.messages}>
      <div className="App">
        <IMUForm />
      </div>
    </IntlProvider>
  );
}

export default App;
