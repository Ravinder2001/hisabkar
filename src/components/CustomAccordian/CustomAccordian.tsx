import React, { ReactNode, useEffect, useState } from "react";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import styles from "./style.module.css";
import { ChevronDown } from "lucide-react";

type AccordionItemProps = {
  header: string;
  children: ReactNode;
  expanded?: boolean;
  padding?: string;
};

const AccordionItem: React.FC<AccordionItemProps & { defaultOpen?: boolean }> = ({ header, children, defaultOpen, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header} <ChevronDown className={styles.chevron} />
      </>
    }
    contentProps={{ className: styles.itemContent }}
    buttonProps={{
      className: ({ isEnter }) => `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
    }}
    initialEntered={defaultOpen}
  >
    {children}
  </Item>
);

const CustomAccordion = (props: AccordionItemProps) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <Accordion transition transitionTimeout={300} style={{ padding: props.padding }}>
      <AccordionItem header={props.header} defaultOpen={props.expanded ?? isDesktop}>
        {props.children}
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
