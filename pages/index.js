import { useState, useEffect } from "react";
import appConfig from "../config.json";
import { useRouter } from "next/router";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";

function Title(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.primary["500"]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

export default function PaginaInicial() {
  const [userName, setUserName] = useState("EtorLucca");
  const router = useRouter();
  const [visible, setVisible] = useState(false);
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
        setVisible(true);
      });
  }, []);
  //-------------------------------------------------------------------------------------

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage:
            "url(https://images3.alphacoders.com/890/890399.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom right",
          backgroundSize: "100% 120%",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "10px",
            padding: "32px 64px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundImage:
              "url(https://images8.alphacoders.com/381/381805.jpg)",
            backgroundSize: "contain",
            backgroundColor: appConfig.theme.colors.neutrals[500],
            backgroundBlendMode: "multiply",
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              router.push("/chat");
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Wellcome back!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.primary[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              fullWidth
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
                if (e.target.value.length > 2) {
                  setVisible(true);
                  fetch(`https://api.github.com/users/${e.target.value}`)
                    .then((res) => {
                      if (res.ok) {
                        return res.json();
                      } else {
                        setVisible(false);
                        setUserImageUrl("");
                        setUserData({ followers: 0, location: "" });
                      }
                    })
                    .then((data) => {
                      if (data) {
                        setUserImageUrl(
                          `http://github.com/${e.target.value}.png`
                        );
                        setUserData(data);
                        setVisible(true);
                      }
                    });
                } else {
                  setVisible(false);
                  setUserImageUrl("");
                  setUserData({ followers: 0, location: "" });
                }
              }}
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              disabled={!visible}
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["999"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "190px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
                display: visible ? "block" : "none",
              }}
              src={userImageUrl}
            />

            {/* ------------------ Imagem caso não tenha usuário --------------------------------------- */}
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
                display: visible ? "none" : "block",
              }}
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            />
            {/* ---------------------------------------------------------------------------------------- */}

            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {visible ? userName : "Invalid username"}
            </Text>

            <Text
              variant="body3"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
                margin: "2px 0",
              }}
            >
              {userData.location}
            </Text>

            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              <i class="fas fa-user-friends"></i>{` ${userData.followers} followers`}
            </Text>

          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
      <script src="https://kit.fontawesome.com/389645fe7b.js" crossorigin="anonymous"></script>
    </>
  );
}
