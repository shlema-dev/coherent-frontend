import "../styles/globals.css";
import { useEffect, useState } from "react";
import Layout from "../components/layout";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import store from "../state/store";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

function WWW({ Component, pageProps }) {
  const [isMobile, setIsMobile] = useState(false);

  const noLayout = Component.noLayout || false;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold">Not available on mobile</p>
      </div>
    );
  }

  const WrappedComponent = noLayout ? (
    <Component {...pageProps} />
  ) : (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );

  return (
    <Provider store={store}>
      <div className={inter.variable}>{WrappedComponent}</div>
      <Toaster position="top-center" />
    </Provider>
  );
}

export default WWW;
