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
import React, { useState } from "react";
import axios from "axios"
  import { useNavigate } from "react-router-dom"; 

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [proficpic, setProfilepic] = useState("");
  const [loading,setLoading] = useState(false)
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = (pic) => {
    // CLOUDINARY_URL=cloudinary://299368564528127:2rruePzwZg7xstcVY3lZN8Hb0kk@divppjtv0
    // POST https://api.cloudinary.com/v1_1/divppjtv0/image/upload
    setLoading(true)
    if (pic === undefined) {
       toast({
         title: "Please Select an Image",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position:"bottom"
       });
      setLoading(false)
      return
    }
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData()
      data.append("file", pic)
      data.append("upload_preset","chat_app")
      data.append("cloud_name", "divppjtv0");
      fetch("https://api.cloudinary.com/v1_1/divppjtv0/image/upload", {
        method: "post",
        body: data
      }).then((res) => res.json())
        .then((data) => {
          setProfilepic(data.url.toString())
          console.log(data.url.toString());
          setLoading(false)
        }).catch((error) => {
          console.log(error)
          setLoading(false)
      })
    }
    else {
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async() => {
    setLoading(true)
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill All the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
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

      const { data } = await axios.post("/api/user", { name, email, password, confirmPassword,proficpic }, config)
      toast({
        title: "Registration is Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(data)
      localStorage.setItem("userInfo", JSON.stringify(data))
      setLoading(false)
      navigate("/chats");


      
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occurred",
        description:error.response.data.message,
        status: "Error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="firstName" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name"
          onChange={(event) => {
            setName(event.target.value);
          }}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
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
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Your Confirm Password"
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
          ></Input>
          <InputRightElement w="4rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="profilePic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => {
            postDetails(e.target.files[0]);
          }}
        ></Input>
      </FormControl>
      <Button colorScheme="blue" width="100%" mt="15px" onClick={submitHandler} isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
