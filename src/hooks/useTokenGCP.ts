// hooks/useTokenGCP.tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const useTokenGCP = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const getTokenGCP = async () => {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://oauth2.googleapis.com/token?client_id=1022876147758-al1d2clcl2118bpuh5pm344sueju7p8l.apps.googleusercontent.com&client_secret=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&grant_type=refresh_token&refresh_token=1//05RpGZWQ3IukTCgYIARAAGAUSNwF-L9IrFTQRnVwaCYR6CFKjmo-Xt9tuQyH1WaTzY4qtcAwIRkRhnMyZmIRZ2zSR1EtCtBANBzk',
        headers: {}
      };

      axios.request(config)
        .then((response) => {
          setToken(JSON.stringify(response.data.access_token));
          console.log(response.data.access_token, "2222")
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getTokenGCP();
  }, []);

  return token;
};

export default useTokenGCP;
