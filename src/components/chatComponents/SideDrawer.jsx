import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text,  Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import Profile from './Profile'
import { ArrowDownIcon } from '@chakra-ui/icons'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'

const SideDrawer = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {user,setSelectedChat,chats, setChats} = ChatState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()
    const history = useHistory()
    const toast = useToast() 
  const logOut = ()=>{
    localStorage.removeItem("userInfo")
    history.push('/')
  }
  const handleSearch = async()=>{
    console.log(search);
    if(!search){
      toast({
        title: 'Enter email or Name',
        description: "",
        status: 'warning',
        duration: 1000,
        isClosable: true,
        position: "top"
      })
    }
    try {
      setLoading(true)
      const config ={
        headers:{
          Authorization: `Bearer ${user.token}`
        }
      }
      const {data} = await axios.get(`/api/user?search=${search}`,config)
      setLoading(false)
      setSearchResult(data)
      console.log(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: "",
        status: 'error',
        duration: 1000,
        isClosable: true,
        position: "top"
      })
    }
  }

  const accessChat = async(userId)=>{
    try {
    setLoadingChat(true)
    const config ={
      headers:{
        Authorization: `Bearer ${user.token}`
      }}
      const {data} = await axios.post('/api/chat',{userId},config)
      if(!chats.find((e)=>e._id===data._id)){
        setChats([data,...chats])
      }
     setSelectedChat(data)
     setLoadingChat(false)
     onClose()
    } catch (error) {
      toast({
        title: 'Error fetching ',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: "top"
      })
      setLoadingChat(false)

    }
  }
  return (
    <>
    <Box style={{display:"flex"}}  bg='white'
    d="flex"
    justifyContent="space-between"
    alignItems="center"
   w='100%'
   p="5px 10px 5px 10px"
   borderWidth="5px"
    >
      <Tooltip
      label="Search Users"
      hasArrow
      placement='bottom-end'
     >
        <Button variant="ghost" onClick={onOpen}>
        <i className="fa-brands fa-searchengin"></i>
        <Text d={{base:"none",md:"flex"}} px="4">Search</Text>
        </Button>
      </Tooltip>
   <Text fontSize="2xl" fontFamily="Work sans">Lets Talk</Text>
 <div>
    <Menu>
        <MenuButton p={1}>
        <i className="fa-solid fa-bell" style={{fontSize:"2xl" ,margin:"1"}}></i>
        </MenuButton>
        {/* <MenuList></MenuList> */}
    </Menu>
    <Menu>
    <MenuButton as={Button}   >
      <Avatar size="sm" cursor="pointer" name={user.name} src={user.picture} />
      <ArrowDownIcon h={10} />
    </MenuButton>
    <MenuList>
        <Profile user={user}>
           <MenuItem>My profile</MenuItem>
        </Profile>
        <MenuItem onClick={logOut}>Log out</MenuItem>
    </MenuList>
    </Menu>

 </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay/>
    <DrawerContent>
        <DrawerHeader >Lets Talk!</DrawerHeader>
        <DrawerBody>
        <Box display="flex" pb="2">
            <Input
            placeholder='Name or Email'
            mr={2}
            value={search}
           
            onChange={(e)=>{setSearch(e.target.value)}}
            />
           <Button 
           onClick={handleSearch}
           >
             Search
           </Button>
        </Box>
        {loading?
         <ChatLoading/>  : searchResult.map((user)=>{ 
        return  <UserListItem
          key={user._id}
          user={user}
          handleFunction={()=>accessChat(user._id)}
          />
         })
      }
      {loadingChat&&<Spinner ml="auto" display="flex"/>}
    </DrawerBody>
    </DrawerContent>
   
    </Drawer>
    </>
   
  )
}

export default SideDrawer