import React, { useContext, useEffect, useState } from 'react'
import "./navbaar.css";
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Rightheader from './Rightheader';
import Avatar from '@mui/material/Avatar';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { LoginContext } from '../context/ContextProvider';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSelector} from "react-redux";
//import { Button } from '@mui/material';

const Navbaar = () => {

    const { account, setAccount } = useContext(LoginContext);
    //console.log(account);

    const history = useNavigate();

    const [anchorE1, setAnchorE1] = useState(null);
    const open = Boolean(anchorE1);
    const handleClick = (event) => {
        setAnchorE1(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorE1(null);
    };

    const [text, setText] = useState("");
    console.log(text);
    const [liopen,setLiopen] = useState(true);

    const {products} = useSelector(state => state.getproductsdata);

    const [dropen, setDropen] = useState(false)

    const getdetailsvaliduser = async () => {
        const res = await fetch("/validuser", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data = await res.json();
        console.log(data);

        if (res.status !== 201) {
            console.log("first login");
        } else {
            console.log("data valid");
            setAccount(data);
        }
    };

    const handleopen = () => {
        setDropen(true)
    }

    const handledrclose = () => {
        setDropen(false)
    }

    const logoutuser = async () => {
        const res2 = await fetch("/logout", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        const data2 = await res2.json();
        console.log(data2);

        if (res2.status !== 201) {
            console.log("error");
        } else {
            console.log("data valid");
            setAccount(false);
            toast.success("user Logout 😃!", {
                position: "top-center"
            });
            history("/");
        }
    };

    const getText = (iteams) =>{
        setText(iteams)
        setLiopen(false)
    }

    useEffect(() => {
        getdetailsvaliduser();
    }, []);

    return (

        <header>
            <nav>
                <div className="left">
                    <IconButton className='hamburgur' onClick={handleopen}>
                        <MenuIcon style={{ color: "#fff" }} />
                    </IconButton>

                    <Drawer open={dropen} onClose={handledrclose}>
                        <Rightheader Logclose={handledrclose} logoutuser={logoutuser} />
                    </Drawer>

                    <div className="navlogo">
                        <NavLink to="/"><img src="./amazon_PNG25.png" alt="" /></NavLink>
                    </div>
                    <div className="nav_searchbaar">
                        <input type="text" name="" 
                        onChange={(e)=>getText(e.target.value)}
                        placeholder="Seach your Products"
                        id="" />
                        <div className="search_icon">
                            <SearchIcon id="search" />
                        </div>

                        {
                            text &&
                            <List className="extrasearch" hidden={liopen}>
                                {
                                    products.filter(product => product.title.longTitle.toLowerCase().includes(text.toLowerCase())).map(product => (
                                        <ListItem>
                                            <NavLink to={`/getproductsone/${product.id}`} onClick={() => setLiopen(true)}>
                                                {product.title.longTitle}
                                            </NavLink>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        }
                    </div>
                </div>
                <div className="right">
                    <div className="nav_btn">
                        <NavLink to="/login">signin</NavLink>
                    </div>
                    <div className="cart_btn">
                        {
                            account ? <NavLink to="/buynow">
                                <Badge badgeContent={account.carts.length} color="primary">
                                    <ShoppingCartIcon id="icon" />
                                </Badge>
                            </NavLink> : <NavLink to="/login">
                                <Badge badgeContent={0} color="primary">
                                    <ShoppingCartIcon id="icon" />
                                </Badge>
                            </NavLink>
                        }

                        <ToastContainer />

                        <p>Cart</p>
                    </div>
                    {
                        account ? <Avatar className='avtar2'
                            id="basic-button"
                            aria-controls="basic-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >{account.fname[0].toUpperCase()}</Avatar> :
                            <Avatar className='avatar'
                                id="basic-button"
                                aria-controls="basic-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            ></Avatar>
                    }

                    <Menu
                        id="basic-menu"
                        anchorEl={anchorE1}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aris-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose} style={{ margin: 5 }}>My account</MenuItem>
                        { 
                            account ? <MenuItem onClick={handleClose} onClick={logoutuser}> <LogoutIcon style={{ fontSize: 16,margin: 5 }}/>Logout</MenuItem> : ""
                        }
                    </Menu>
                </div>
            </nav>
        </header>
    )
}

export default Navbaar