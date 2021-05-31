(function(global){
	var projectClass = {};
	
	var homeHtml = "snippets/home-snippet.html";
	var homeFooterHtml = "snippets/footer-snippet.html";
	var allCategoriesUrl = "data/categories.json";
	var ammountOfCategories = 0;
	var categoriesTitleHtml = "snippets/category-title-snippet.html";
	var categoryHtml = "snippets/category-snippet.html";
	var catalogItemsUrl = "categories/";
	var catalogItemsTitleHtml = "snippets/catalog-item-title.html";
	var catalogItemsHtml = "snippets/catalog-item.html";


	projectClass.nameOfUser = "";
	projectClass.nameOfSite = "ПродуктЇ";

	projectClass.getUserName = function(){
		nameOfUser = document.querySelector("#nameInput").value;
		if(nameOfUser.length > 0)alert("Дякую за вашу увагу, " + nameOfUser);
		else alert("Ви не увели ім'я, спробуйте ще раз");
	}

	var insertHtml = function(selector, html){
		var inner = document.querySelector(selector);
		inner.innerHTML = html;
	};

	var insertProperty = function(string, propName, propValue){
		var propToReplace = "{{" + propName + "}}";
		string = string.replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	};

	projectClass.insertHtml = insertHtml;

	var showLoading = function(selector){
		var html = '<div class="text-center">';
		html += '<img class="d-block m-auto" src="images/gif_load.gif" alt="loading"></div>';
		insertHtml(selector, html);
	};

	document.addEventListener("DOMContentLoaded", function(event){
		showLoading("#main-content");
		$ajaxUtil.sendGetRequest(
			homeHtml, function(responseText){
				insertHtml("#main-content", responseText);
			}, false);
		$ajaxUtil.sendGetRequest(
			homeFooterHtml, function(responseText){
				insertHtml("#footer-content", responseText);
			}, false);
		insertHtml('#brand-name', projectClass.nameOfSite);
		document.title = projectClass.nameOfSite;
	});

	var loadCatalogItems = function(categoryShort){
		showLoading("#main-content");
		if(categoryShort != undefined)
			$ajaxUtil.sendGetRequest(catalogItemsUrl + categoryShort + ".json",
					buildAndShowCatalogItemsHTML);

		else {
			$ajaxUtil.sendGetRequest(allCategoriesUrl,
					function(categories){
						var randNumer = getRandom(categories.length);
						$ajaxUtil.sendGetRequest(catalogItemsUrl + categories[randNumer].shortname + ".json",
					buildAndShowCatalogItemsHTML);
						document.title = categories[randNumer].name;
					});
		}
	}

	projectClass.loadCatalogItems = loadCatalogItems;

	var loadCatalogCategories = function(){
		showLoading("#main-content");
		document.title = projectClass.nameOfSite + " - Каталог";
		$ajaxUtil.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);				
	};

	projectClass.loadHome = function(){
		showLoading("#main-content");
		$ajaxUtil.sendGetRequest(
			homeHtml, function(responseText){
				insertHtml("#main-content", responseText);
			}, false);
		document.title = projectClass.nameOfSite;
	};
	projectClass.loadCatalogCategories = loadCatalogCategories;	
	function buildAndShowCategoriesHTML(categories){
		$ajaxUtil.sendGetRequest(categoriesTitleHtml, 
			function(categoriesTitleHtml){
				$ajaxUtil.sendGetRequest( 
					categoryHtml,
						function (categoryHtml) {
							var categoriesHtml = buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml);
							insertHtml("#main-content", categoriesHtml);
						}, false);
			}, false);
	}

	function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml){
		//
		var finalHtml = categoriesTitleHtml;
		finalHtml += '<section class="row">';

		for(var i = 0; i < categories.length; i++){
			var html = categoryHtml;
			var name = "" + categories[i].name;
			var short_name = "" + categories[i].shortname;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			finalHtml += html;			
		}

		finalHtml += '</section>';
		return finalHtml;
	};

	function buildAndShowCatalogItemsHTML (categoryCatalogItems){
		$ajaxUtil.sendGetRequest(
			catalogItemsTitleHtml,
			function (catalogItemsTitleHtml){
				$ajaxUtil.sendGetRequest(
					catalogItemsHtml,
					function(catalogItemHtml){
						var catalogItemsViewHtml = buildCatalogItemsViewHtml(categoryCatalogItems,
							catalogItemsTitleHtml,
							catalogItemHtml);
						insertHtml("#main-content", catalogItemsViewHtml);
					}, false);			
		}, false);
		document.title = projectClass.nameOfSite + " - " + categoryCatalogItems.category.name;
	};

	function buildCatalogItemsViewHtml(categoryCatalogItems, catalogItemsTitleHtml, catalogItemHtml){
		catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "name", categoryCatalogItems.category.name);
		catalogItemsTitleHtml = insertProperty(catalogItemsTitleHtml, "special_instruction", categoryCatalogItems.category.special_instruction);
		var finalHtml = catalogItemsTitleHtml;		
		finalHtml += '<section class="row">';

		var catalogItems = categoryCatalogItems.catalog_items;
		var catalogShortName = categoryCatalogItems.category.catalog_items;

		for(var i = 0; i < catalogItems.length; i ++){
			var html = catalogItemHtml;
			html = insertProperty(html, "short_name", catalogItems[i].shortname);
			////html = insertProperty(html, "short_name", catalogItems[i].category.shortname);
			html = insertProperty(html, "price", catalogItems[i].price);
			html = insertProperty(html, "ammount_retail", (catalogItems[i].ammount_retail == null)? 0 : catalogItems[i].ammount_retail);
			html = insertProperty(html, "name", catalogItems[i].name);
			html = insertProperty(html, "description", catalogItems[i].description);
			finalHtml += html;
		}

		finalHtml += "</section>";

		return finalHtml;
	}

	var getRandom = function(max){//x = {x є N && x < max}
		return (Math.round(Math.random()*(max-1)));		
	};

	projectClass.getRandom = getRandom;

	global.$projectClass = projectClass;
})(window);

//window.$projectClass.insertHtml(".navbar-brand", '<h2>Logo</h2>');