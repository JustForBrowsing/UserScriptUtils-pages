## Code Snippets
### Hash function, for shader

```GLSL
float hash( vec2 f ) {
    uvec2 x = floatBitsToUint(f),
    q = 1103515245U * ( x>>1U ^ x.yx    );
    return float( 1103515245U * (q.x ^ q.y>>3U) ) / float(0xffffffffU);
}
```

## API / Interface Notes
### DuckDuckGo Searching 

#### Basic Searching
Search by title or tag contents:
    “Windows”, “puzzle”, “multiplayer”,
Use double quotes to tie terms together

NOT (in all caps) inverts the search: “NOT HTC Vive”


#### Advanced Search
##### Search Operators

| Example	                | Result  |
| :---------------------- | :------------------------------------------ |
| cats dogs              	| Results about cats or dogs |
| "cats and dogs"        	| Results for exact term "cats and dogs". If no or few results are found, we'll try to show related results. |
| ~"cats and dogs"       	| Experimental syntax: more results that are semantically similar to "cats and dogs", like "cats & dogs" and "dogs and cats" in addition to "cats and dogs". |
| cats -dogs	            | Fewer dogs in results |
| cats +dogs	            | More dogs in results |
| cats filetype:pdf	      | PDFs about cats. Supported file types: pdf, doc(x), xls(x), ppt(x), html |
| dogs site:example.com	  | Pages about dogs from example.com |
| cats -site:example.com	| Pages about cats, excluding example.com |
| intitle:dogs	          | Page title includes the word "dogs" |
| inurl:cats	            | Page URL includes the word "cats" |

##### Search Directly on Other Sites
Use \ to go to directly to the first search result. For example,  \futurama.
Use ! to search other sites' search engines directly. Remember, though, because your search is actually taking place on that other site, you are subject to that site’s policies, including its data collection practices. For example,  !a blink182 searches Amazon.com for blink182. There are thousands of sites covered!

##### Safe Search
Add !safeon or !safeoff to the end of your search to turn on and off safe search for that search.
