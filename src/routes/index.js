import React from "react";

import AppRoutes from "./app.routes";
import { NavigationContainer } from "@react-navigation/native";

function Routes() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}

export default Routes;
