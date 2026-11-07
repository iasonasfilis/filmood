import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
 return {name:"FILMOOD. — Find your mood. Find your movie.",short_name:"FILMOOD.",description:"Discover films by mood and cinematic DNA.",start_url:"/studio",scope:"/",display:"standalone",background_color:"#100e14",theme_color:"#100e14",orientation:"portrait-primary",icons:[{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}]};
}
