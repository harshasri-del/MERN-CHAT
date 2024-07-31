import { Container, Box, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";


const Homepage = () => {

  const navigate = useNavigate();
  const user= JSON.parse(localStorage.getItem("userInfo"))
  if (user) {
    navigate("/chats")
  }

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        p={3}
        justifyContent={"center"}
        bg={"white"}
        w="100%"
        m="40px 0 14px 0"
        borderRadius="lg"
        borderWidth="1px"
        alignItems={"center"}
        textAlign={"center"}
      >
        <Text fontSize={"2xl"} fontFamily={"Work sans"} color={"black"}>
          CHAT APP
        </Text>
      </Box>
      <Box
        maxW="xl"
        w="100%"
        borderRadius="lg"
        bg="white"
        p="3"
        m="40px 0 a5px 0"
        borderWidth="1px"
        color="black"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
