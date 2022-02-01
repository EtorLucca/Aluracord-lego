import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import appConfig from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { createClient } from "@supabase/supabase-js";
import LoadingPage from "../src/components/loading";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import UserCard from "./card";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMwNTIzMCwiZXhwIjoxOTU4ODgxMjMwfQ.OOABSmkcz3c3T7dwxkpGVFCFXgrtn8KPwUJzJakrO5M";
const SUPABASE_URL = "https://guxoddrtdsqmmqqjxoph.supabase.co";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function realTime(addMensagem){
  return supabaseClient
    .from("mensagens")
    .on("INSERT", (live) => {
      addMensagem(live.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const router = useRouter();
  const usuarioLogado = router.query.username;
  const [textoMsg, setTextoMsg] = useState("");
  const [listaMensagens, setListaMensagens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    supabaseClient
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaMensagens(data);
      });

      realTime((newMessage) => {
        setListaMensagens((currentListValue) => {
          return [newMessage, ...currentListValue]
        });
      });
  }, []);

  function PageSelector() {
    if (loading) {
      return (
        <>
          <LoadingPage />
          <LoadingPage />
          <LoadingPage />
        </>
      );
    } else {
      return (
        <MessageList
          mensagens={listaMensagens}
          setMensagens={setListaMensagens}
        />
      );
    }
  }

  function handleNovaMensagem(newMessage) {
    const mensagem = {
      de: usuarioLogado,
      texto: newMessage,
    };

    supabaseClient
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => {
        console.log(data);
      });

    setTextoMsg("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://cdn.pixabay.com/photo/2018/08/16/10/36/lego-3610098_960_720.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 120%",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <PageSelector />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              autoFocus
              placeholder="Insira sua mensagem aqui..."
              value={textoMsg}
              onChange={(e) => {
                setTextoMsg(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleNovaMensagem(textoMsg);
                }
              }}
              type="textarea"
              styleSheet={{
                width: "95%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker onStickerClick={(sticker) => {
              handleNovaMensagem(":sticker: " + sticker);
            }} />
            <FontAwesomeIcon
              onClick={(e) => {
                if (textoMsg.length > 0) {
                  e.preventDefault();
                  handleNovaMensagem(textoMsg);
                }
              }}
              style={{
                cursor: "pointer",
                color: "white",
                fontSize: "30px",
                margin: "5px",
                padding: "5px",
              }}
              icon={faPaperPlane}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  async function handleDelete(id) {
    await supabaseClient.from("mensagens").delete().match({ id: id });
    props.setMensagens(props.mensagens.filter((i) => i.id !== id));
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        function show(id) {
          //console.log("show", id);
          document.getElementById(`card + ${id}`).style.display = "flex";
        }

        async function reset(id) {
          //console.log("reset", id);
          document.getElementById(`card + ${id}`).style.display = "none";
        }
        return (
          <Text
            id={mensagem.de}
            onMouseLeave={(e) => {
              reset(e.target.id);
            }}
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            {/* -----------------------------------------------------------------------------------------------------------    */}
            <UserCard id={mensagem.de} />
            {/* -----------------------------------------------------------------------------------------------------------    */}
            <Box
              styleSheet={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Image
                id={mensagem.de}
                onMouseEnter={(e) => {
                  show(e.target.id);
                }}
                styleSheet={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong" id={mensagem.de}>
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <FontAwesomeIcon
                onClick={() => handleDelete(mensagem.id)}
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
                icon={faTrashAlt}
              />
            </Box>
            {mensagem.texto.startsWith(":sticker:")
              ? <Image 
                  src={mensagem.texto.replace(":sticker:", "")}
                  styleSheet={{
                    maxWidth: "100px",
                  }}
                />
              : mensagem.texto}
          </Text>
        );
      })}
    </Box>
  );
}
