import React from "react";
import Navbar, {Nav} from "../../nav/Navbar";
import MenuContent from "./MenuContent";
import Logo from "../../logo/Logo";


const menuContent = [
    {name: "메인페이지", href: "/"},
    {name: "영업 인프라", href: "/works"},
    {name: "상담 문의", href: "/contact"},
];

const EremiaMenu = ({hamburger}) => {

    let $key = 0;
    const getSubMenu = (items) => {
        $key++;
        if (items.dropdownMenu) {
            return (<Nav.Dropdown name={items.name}
                                  key={$key}>{items.dropdownMenu.map(item => getSubMenu(item))}</Nav.Dropdown>);
        }
        return (
            <Nav.Link href={items.href} key={$key}>{items.name}</Nav.Link>
        );
    }


    return (
        <Navbar hamburger={hamburger}>
            <Navbar.Brand href={"/"} transitionPage={{title: "WORK VISA"}}>
                <Logo width="75px" height="auto"/>
            </Navbar.Brand>

            <Navbar.Collapse cover="Menu">
                <Nav>
                    {menuContent.map(item => getSubMenu(item))}
                </Nav>
                <MenuContent className="section-margin"/>
            </Navbar.Collapse>
        </Navbar>
    );

}

EremiaMenu.defaultProps = {
    hamburger: false
}


export default EremiaMenu;