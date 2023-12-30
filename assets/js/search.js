import Fuse from 'fuse.js'
import AcmeSearchSupport from "searchSupport.js"

let index = null;
const MAX_SEARCH_RESULTS =5;

export default { 
    async init() { 
    // Try to get the JSON index hosted as a pseudo-API on the website
      try { 
        const response = 
          await window.fetch(BASE_URL + "/index.json");    
        if (!response.ok) {                     
          this.removeSearch(); 
          return;
        
        // Keyboard Handling
        AcmeSearchSupport(); 
        } 
        let data = await response.json();
        
        // Init Query Fuse search library    
        index= new Fuse(data, {                      
            keys: [{ 
              name: 'title',                           
              weight: 20 
            }, { 
              name: 'tag', 
              weight: 5 
            }, { 
              name: 'content'                          
            }] 
          });
        // Just to test. Do not leave in code. 
        console.log(index.search('acme'));
      } 

    // Remove the Search bar on error
      catch(e) { 
        this.removeSearch();                    
      } 

    // Event Listeners
        document.addEventListener("input",                       
            this.showResults);

    }, 
    
    // Methods
    removeSearch() { 
        document.querySelector("#search")?.remove(); 
    },
    

    // Event Listeners methods
    showResults(event) { 
        const searchBox = document.querySelector("search input"); 
        if (event.target !== searchBox) { 
          return; 
        } 
        const result = document.querySelector("#search div"); 
        result.style.display = "block"; 
        if (searchBox.value.length > 0) { 
          const results = index.search(searchBox.value); 
          result.innerHTML = results                             
            .slice(0, MAX_SEARCH_RESULTS)                                                
            .map(x => `<a href="${x.item.url}"> 
              <img src="${x.item.cover || ""}" 
                 width="40" height="40"> 
              <h3>${x.item.title}</h3> 
              <span>${x.item.content.substr(0,40)}</span> 
            </a>`)                                               
            .join(""); 
        } else { 
          result.innerHTML = ''; 
        } 
    } 
  } 