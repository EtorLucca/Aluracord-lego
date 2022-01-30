import { Box, Text, Image } from "@skynexui/components";
import React, { useState, useEffect } from "react";
import appConfig from "../config.json";

export default function UserCard(props) {
  const userName = props.id
  const [userImageUrl, setUserImageUrl] = useState("");
  const [userData, setUserData] = useState({ followers: 0, location: "" });

  //-------------------------- Controle de usuário --------------------------------------
  useEffect(() => {
    fetch(`https://api.github.com/users/${userName}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        setUserImageUrl(`https://github.com/${userName}.png`);
        setUserData(data);
      });
  }, []);
  //-------------------------------------------------------------------------------------

  return (
      <Box
          id={`card + ${userName}`}
          styleSheet={{
          alignItems: "center",
          border: "1px solid",
          borderColor: appConfig.theme.colors.neutrals[900],
          display: "none",
          height: "150px",
          justifyContent: "left",
          width: "350px",
          backgroundColor: appConfig.theme.colors.neutrals[900],
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <Image
          styleSheet={{
            borderRadius: "100%",
            width: "120px",
          }}
          src={userImageUrl}
        />
        <Box
          styleSheet={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text
            variant="body4"
            styleSheet={{
              color: appConfig.theme.colors.neutrals[200],
              padding: "3px 10px",
            }}
          >
            {userName}
          </Text>
          <Text
            variant="body4"
            styleSheet={{
              color: appConfig.theme.colors.neutrals[200],
              padding: "3px 10px",
            }}
          >
            <a
              href={`${userData.html_url}`}
              style={{
                textDecoration: "none",
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[500],
                padding: "2px 5px",
              }}
            >
              {userData.html_url}
            </a>
          </Text>
          <Text
            variant="body4"
            styleSheet={{
              color: appConfig.theme.colors.primary[50],
              padding: "10px 10px",
            }}
          >
            {userData.bio}
          </Text>
        </Box>
      </Box>
  );
}
