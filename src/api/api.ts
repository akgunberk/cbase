import "dotenv/config";
import axios, { AxiosInstance } from "axios";
import { API_OPTIONS } from "./constants";

interface ICodebaseAPI {
  _api: AxiosInstance | undefined;
  initInstance: () => void;
  getInstance: () => AxiosInstance;
}

const CodebaseAPI: ICodebaseAPI = {
  _api: undefined,
  initInstance: async function () {
    this._api = axios.create(API_OPTIONS);
  },
  getInstance: function () {
    if (!this._api) this.initInstance();

    return this._api!;
  },
};

export { CodebaseAPI };
