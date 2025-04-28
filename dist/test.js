"use strict";
// multiRequest.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
const urls = [
    'http://127.0.0.1:3000/m3u8-proxy.m3u8?url=https%3A%2F%2Ftest-streams.mux.dev%2Fx36xhzz%2Fx36xhzz.m3u8&headers={}',
    'http://127.0.0.1:3000/ts-proxy.ts?url=https%3A%2F%2Fraw.githubusercontent.com%2FNicolasCARPi%2Fexample-files%2Frefs%2Fheads%2Fmaster%2FREADME.md&headers={}',
    //   'http://127.0.0.1/3',
];
function fetchUrls(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Send requests with a timeout of 1.5 seconds
            const requests = urls.map(url => axios_1.default.get(url, { timeout: 1500 }) // Timeout set to 1.5 seconds
            );
            const responses = yield Promise.all(requests);
            // Check if all responses are successful
            const failedResponses = responses.filter(response => response.status !== 200);
            if (failedResponses.length > 0) {
                throw new Error('One or more URLs are unavailable or failed to respond within 1.5 seconds');
            }
            console.log('All URLs are available within the timeout');
        }
        catch (error) {
            if (error instanceof axios_1.AxiosError) {
                if (error.code === 'ECONNABORTED') {
                    console.error('Request timed out for one or more URLs');
                }
                else {
                    console.error('Error occurred while fetching URLs:', error.message);
                }
            }
            else {
                console.error('Unknown error occurred:', error);
            }
        }
    });
}
fetchUrls(urls);
