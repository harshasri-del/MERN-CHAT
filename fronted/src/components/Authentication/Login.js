import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom"; 



const Login = () => {
 const [show, setShow] = useState(false);
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
   const toast = useToast();


  
 const handleClick = () => {
   setShow(!show);
 };


  const submitHandler = async() => {
    setLoading(true)
    if (!email || !password) {
      toast({
        title: "Please Fill All the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {

      const config = {
        headers: {
          "Content-type":"application/json"
        }
      }

      const { data } = await axios.post("/api/user/login", { email, password }, config)
       toast({
         title: "Login Successful",
         status: "success",
         duration: 5000,
         isClosable: true,
         position: "bottom",
       });
      console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/chats");
 
      
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    
 };

 return (
   <VStack spacing="5px" color="black">
     <FormControl isRequired>
       <FormLabel>Email</FormLabel>
       <Input
         value={email}
         type="text"
         placeholder="Enter Your Email"
         onChange={(event) => {
           setEmail(event.target.value);
         }}
       ></Input>
     </FormControl>
     <FormControl isRequired>
       <FormLabel>Password</FormLabel>
       <InputGroup>
         <Input
           value={password}
           type={show ? "text" : "password"}
           placeholder="Enter Your Password"
           onChange={(event) => {
             setPassword(event.target.value);
           }}
         ></Input>
         <InputRightElement w="4rem">
           <Button h="1.75rem" size="sm" onClick={handleClick}>
             {show ? "Hide" : "Show"}
           </Button>
         </InputRightElement>
       </InputGroup>
     </FormControl>

     <Button
       colorScheme="blue"
       width="100%"
       mt="15px"
       onClick={submitHandler}
       isLoading={loading}
     >
       Login
     </Button>
     <Button
       variant="solid"
       colorScheme="red"
       width="100%"
       mt="15px"
       onClick={() => {
         setEmail("guest@gmail.com");
         setPassword("123456");
       }}
     >
       Guest User
     </Button>
   </VStack>
 );
}

export default Login
