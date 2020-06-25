import './styles/character.scss'
//get headers
const selectHeader1 = document.getElementById("Select-tab-1");
const selectHeader2 = document.getElementById("Select-tab-2");
const selectHeader3 = document.getElementById("Select-tab-3");
//get components/pages
const selectFacePage = document.getElementById("Select-face-page"); 
const selectClothesPage = document.getElementById("Select-clothes-page"); 
const selectAccessoriesPage = document.getElementById("Select-accessories-page"); 

// add event listeners/enable change of tab
selectHeader1.addEventListener("click",()=>{
    if (selectHeader1.className==="Select-header-1-alternate"){ // change header styles {if background is black}
        selectHeader1.className = "Select-header-1";
        selectHeader2.className="Select-header-2-alternate";
        selectHeader3.className = "Select-header-3-alternate";
        //pages {display face page, hide the others}
        selectClothesPage.className = "Select-clothes-components-alternate";
        selectFacePage.className = "Select-face-components";
        selectAccessoriesPage.className = "Select-accessories-components-alternate";   
    }
});
selectHeader2.addEventListener("click",()=>{
    if (selectHeader2.className==="Select-header-2-alternate"){// change header styles {if background is black}
        selectHeader2.className = "Select-header-2";
        selectHeader1.className = "Select-header-1-alternate";
        selectHeader3.className = "Select-header-3-alternate";
        //pages {display clothes page, hide the others}
        selectClothesPage.className = "Select-clothes-components";
        selectFacePage.className = "Select-face-components-alternate";
        selectAccessoriesPage.className = "Select-accessories-components-alternate";
    }
});
selectHeader3.addEventListener("click",()=>{
    if (selectHeader3.className==="Select-header-3-alternate"){// change header styles {if background is black}
        selectHeader2.className = "Select-header-2-alternate";
        selectHeader1.className = "Select-header-1-alternate";
        selectHeader3.className = "Select-header-3";
        //pages {display accessories page, hide the others}
        selectClothesPage.className = "Select-clothes-components-alternate";
        selectFacePage.className = "Select-face-components-alternate";
        selectAccessoriesPage.className = "Select-accessories-components";    
    }
});

