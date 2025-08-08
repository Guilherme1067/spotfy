import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

interface ITokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  refreshToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshToken = async () => {
    const newToken = await fetchAccessToken();
    setToken(newToken);
    return newToken;
  };

  useEffect(() => {
    refreshToken().finally(() => setIsLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ refreshToken }}>
      {children} 
    </AuthContext.Provider>
  );
};
