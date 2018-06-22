import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Utilities } from './utinities';

@Injectable({providedIn: 'root'})
export class ConfigService {
  public static readonly appVersion: string = "6.0";
  constructor(){        
    if(location.port && (location.port == "3000") || (location.port== "4200") )
      this.urls.baseUrl = "http://localhost:5000/"; // kestrel
}

// top level search text
searchText = "";
activeTab = "albums";
isSearchAllowed = true;
// applicationStats:ApplicationStats = new ApplicationStats();

urls = {
  baseUrl: null,
  albums: "api/albums",
  album: "api/album",
  artists: "api/artists",
  artist: "api/artist",
  artistLookup: "api/artistlookup?search=",
  saveArtist: "api/artist",
  login: "/token", //"api/login",
  logout: "api/logout",
  isAuthenticated: "api/isAuthenticated",
  reloadData: "api/reloadData",
  applicationStats: "api/applicationstats",
  url: (name,parm1?,parm2?,parm3?) => {
    var url = this.urls.baseUrl + this.urls[name];
    if (parm1)
      url += "/" + parm1;
    if (parm2)
      url += "/" + parm2;
    if (parm3)
      url += "/" + parm3;

    return url;
  }
};

 
/**
* Http Request options to for requests
* @type {RequestOptions}
*/  
requestHeaders = { withCredentials: true};


}
