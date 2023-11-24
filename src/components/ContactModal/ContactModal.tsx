import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal } from "antd";

import styles from "./style.module.scss";

type props = {
  status: boolean;
  handleModal: () => void;
};
const ContactModal = (props: props) => {
  const handleClick = (link: string) => {
    window.location.href = link;
  };
  return (
    <Modal className={styles.modal} width={300} title="Contact" open={props.status} closeIcon footer={null} onCancel={props.handleModal}>
      <div>
        <div className={styles.heading}>Developed by!</div>
        <div className={styles.name}>Ravinder Singh Negi</div>
        <div className={styles.box}>
          <div className={styles.icon} onClick={() => handleClick("https://www.linkedin.com/in/ravinder-singh-negi-3444bb1a6/")}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByElEQVR4nO2ZP0/CQBjG22scXI2Tiauy+glc3MC4+iX8DA6G9IiDJsYBBhdNHJwcNRGIHY3xjoBCgkTEAUP8A63yt7ymBVQEIq2mvSb3JM/UN5fnd+97N1wFgYuLi4tpSTJdQTKJI5lqCFNwxDLVRExjkkyW/xRexAQ7FhoPt4hJ0P7OuxwedS2FSMAygDk2DIRHRhdkGrUOgInqdnDUs0wqNgAYCI6//G8AvkgazgsaaA0dlIIG8+G0twCUggbfFb/XvAWgNfQ+ALWuewtA8XoHfJG0CWF0IpZXYS584y0A5JIFDoA7OzFM43yf3b2G7YsSpEpVqDbb8FprmaO4dvoAk5sJtgEW9jLw+NaEUbosvsPMTopdgOxLHX5TLK+CxCrAuPIf5dgE0Ntgzv/S4S2sHucheqcOrdtPPrMJsK4U+2omQgk4yVUG6jJPNTYBpreTA+ssHmQH6sq1FnsA7R/fe57aSo5d63oH7K6FOADmHTDFRwjzQ0z5LYT4NWpRo24Otyx4+mkR07JlAON9noHgYFjE9MwygPFzwe3gqGsJX/ktA3S6QIJuhxcx2bAV/rMTIRIw3uedPRNENcbG9s5zcXFxCU7pA5Jwntel+S2tAAAAAElFTkSuQmCC" />
          </div>
          <div className={styles.icon} onClick={() => handleClick("https://github.com/Ravinder2001")}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFfUlEQVR4nO2Z20sjVxzHR0tLu/QG7fZp2z9ACoVOHDNJdJI4mcxkotgWr9UnFQQv9cFL8RbxwY24also26UPImjFiu2DVBHRBx/ESx+sbkFQtGIsqHW90EQTSU75HXZCms3EyWXcF7/wgzAz0e/n/H5zzvmdEMSd7nSnhJWfn/9KdnY2bTabW8xm84TJZPrTZDI9MxqNPgiGYZ5lZWU9zczMnDAYDC16vV5LEEQq8bLFcdyHFovFybKsKzs7G0GYzWYcJpMJGY1GHAzD4MjKykKZmZk49Hr9vsFgeEhR1INbN87z/H2O456wLOu1WCyIZVkUK4DBYMCh1+u9NE0/Zhjm/Vsxz3FcicViOeE4DoH5JAAgnU4H8Q9N00WqGSdJ8lWe53+0Wq0IzKsAgGiahvgB/ldSzdvt9ntWq3WK53l0CwBIq9X+RpLkvWSOPDZ/iwCIoqjZtLS01xIGgLIRBAGbhwDjklkIMJ8IgE6nQxkZGThCAZ5fe5yo+S/BfCgAjHhPTw+amZlB/f39KDc3F5sF0xKAZD7UeDgAGBUEAfX29qKpqSnU1taGjYcBII1GUxiX+by8vPcEQTgOBwCD29vbSNLl5SUaGRnBpSUZLioqQpWVlai+vh5HRUUFKigoCJYLZGx0dBR5vd7g31lbW4OyeQEgPT39hCTJ2KdYURSf2Gw2FA4A4ff7UbgODw/R+vo6BpKTx+PBRo+Pj1+4d3V1FREArlEU9X1M5nmef2Cz2byRAHJycpBaouQBvCRJfhTL6DtFUUSRAOAljjbK8er8/BzKRQ4A3oWHisw7HI5UURT35QDgHdjY2Eg6wPLycrQMAIALNo03AtjtdhrMRwKA0W9tbUWBQCDpAIFAANXV1WHzkQAgOyRJUkrKp0UOAKbQ/f19pJb29vaw6SgAXyvJwC+RAGCabG5uRmqruro6aD4cQKPRjCvJwNNIAFA+Y2NjqgMMDQ1hwzIA60oycBIJAMpnYWFBdYDZ2VlsVgbgWEkGvJEAYPVcWVlRHWBxcTEawJUSALdcBubn51UHmJ6ejgbwr5IS+kvuHRgfH1cdYHh4WPYdIElyVwnA73KzUGdnp+oAjY2N0WahZSUA43LrAGyd3W63aubdbjde6aOsA2NKAOqiLWSQYrU0ODgYdSHTaDTVNwKIoviJHIDUTsK2Odna3NwMNjpRAD6OazMnmZf2Q1BKS0tLSd3IcRwXsSMLAdgjCCKFUCKbzdYqAYBp6LBqamqCTTwE1KrD4UBbW1txG9/Z2UEdHR1B4xF64lCAm/dBoSdvoiheAgCM/MDAAO7CoHRqa2vxoiY199D7lpSU4GcmJyfR6emprGG4B89AL11YWIiNSicS4acSYQBXNE1/QMQiURS/k0oIRryhoSHYEpaWlv4vGwACjTxch9ZQTj6fD5WVleHe+KZjlYwQgPT09G9iMv88C28LguAKXcicTic6OjrCWwooMciEBACZgFX0Js3NzWGzMQD8TZLkO0Q8EgThi0j9wMHBAYaA+i0uLsbR1dWFLi4ubgQ4OzvDBmMAyIvLfEgmHoV2ZO3t7bh7glhdXUW7u7vI5XLhXaQSwfeUAlAU5SSSoBRBEH6SemIol+7u7oRWZIUAPyftR5D8/Pw3eJ6fkNYDgIDPTU1NqK+vD5+uQbemtFdWADDOMMzrRJKVYrVaO0MPd0PPReHYMBkAWq32W1V/frJarZ9zHOcKP51OAsC+Vqv9jLgN5ebmvsVxXD/LsleJAuh0ukudTveIYZg3idsWwzDvsiz7ldls3q2qqkJKVV5eDuVyoNfrOw0Gw33iZQshlHp0dPTp6elpg8fj+dXn861fX18f+P1+DwR89vl8f8A9eAaehe8Qd7rTnYhE9R+kV7M+FoRFRQAAAABJRU5ErkJggg==" />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ContactModal;
