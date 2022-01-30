import { Box, Text } from "@skynexui/components";
import appConfig from "../config.json";
import React from "react";

export default function LoadingPage() {
  return (
    <Box
      tag="ul"
      styleSheet={{
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      <Text
        tag="li"
        styleSheet={{
          borderRadius: "5px",
          display: "flex",
          flexDirection: "column",
          padding: "6px",
          marginBottom: "12px",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <Box
            styleSheet={{
              backgroundColor: "#00000050",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              display: "inline-block",
              marginRight: "8px",
            }}
          />
          <Box
            styleSheet={{
              backgroundColor: "#00000050",
              width: "150px",
              height: "20px",
              borderRadius: "8px",
              display: "inline-block",
              marginRight: "8px",
            }}
          />
          <Box
            styleSheet={{
              backgroundColor: "#00000050",
              width: "100px",
              height: "12px",
              borderRadius: "8px",
              marginRight: "8px",
              color: appConfig.theme.colors.neutrals[300],
            }}
            tag="span"
          />
        </Box>
        <Box
          styleSheet={{
            backgroundColor: "#00000040",
            width: "300px",
            height: "20px",
            borderRadius: "8px",
            marginRight: "8px",
            marginLeft: "10px",
          }}
          tag="span"
        />
      </Text>
    </Box>
  );
}
