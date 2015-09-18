document.addEventListener("DOMContentLoaded", function(){
	var baseAPIUrl = "https://api.twitch.tv/kraken/search/streams?q="

	var searchForm = document.getElementsByTagName("form")[0]
	searchForm.addEventListener("submit", returnSearchResults)
	var searchBar = searchForm.children[0]

	var resultsMessage = document.getElementById('results-message')
	var searchResults = document.getElementById('search-results')
	var searchResultsList = document.getElementById('search-results-list')
	var resultsCountText = document.getElementById('results-count')

	var pageIndex = document.getElementById("page-index")
	var currentPageNumber = document.getElementById("current-page-number")
	var totalPageCount = document.getElementById("total-num-pages")
	var nextPageLink = document.getElementsByClassName("next-link")[0]
	var previousPageLink = document.getElementsByClassName("previous-link")[0]

	function returnSearchResults(event){
		event.preventDefault()
		resultsMessage.style.visibility = 'visible'
		clearSearchResultsList();

		var searchQuery = searchBar.value

		var xmlhttp;
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp=new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
		  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		  }
		xmlhttp.onreadystatechange=function()
		  {
		  if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		    {

		    var queryResults = JSON.parse(xmlhttp.responseText)

		    updateResults(queryResults['_total'])

		    handlePagination(queryResults)

		    var streamResults = queryResults["streams"]
		    streamResults.forEach(function(result){
		    	var newRow = createSearchResultRow(result)
		    	searchResultsList.appendChild(newRow)
		    	newRow.appendChild(createThumbnailImage(result))
		    	var infoBox = createInfoBox();
		    	newRow.appendChild(infoBox)
		    	infoBox.appendChild(addStreamName(result))
		    	infoBox.appendChild(addViewersCount(result))
		    	infoBox.appendChild(addStreamDescription(result))
		    })
		    }
		  else if(xmlhttp.readyState == 4 && xmlhttp.status == 400){
		  	updateResults()
		  }

		  }  
		xmlhttp.open("GET", baseAPIUrl + searchQuery, true)
		xmlhttp.send()
		resetSearchBar();
	}

	function clearSearchResultsList(){
		searchResultsList.innerHTML = "";
	}

	function updateResults(resultsCount){
		if(resultsCount === 0 || resultsCount === undefined){
			hideResultsCount();
			throwNoResultsMessage();
		}
		else{
			showPageIndex()
			resultsCountText.innerText = resultsCount
			showResultsCount();
		}
	}

	function handlePagination(queryResults){
		hidePreviousLinkButton()
		hideNextLinkButton()
		if(queryResults["_total"] > 10){
			var indexOfResultPageNumber = queryResults["_links"]["self"].indexOf("offset")

			var resultPageNumber = parseInt(queryResults["_links"]["self"].substring(indexOfResultPageNumber + 7, indexOfResultPageNumber + 8)) + 1
			currentPageNumber.innerText = resultPageNumber

			var indexOfLimitParam = queryResults["_links"]["self"].indexOf("limit")
			var requestLimit = queryResults["_links"]["self"].substring(indexOfLimitParam + 6, indexOfLimitParam + 8)
			var totalNumOfPages = Math.ceil(queryResults["_total"] / requestLimit)
			totalPageCount.innerText = totalNumOfPages

			if(queryResults["_links"]["next"] && resultPageNumber !== totalNumOfPages){
				showNextLinkButton()
				nextPageLink.setAttribute("href", queryResults["_links"]["next"])
				nextPageLink.addEventListener('click', navigateToPage)
			}
			if(queryResults["_links"]["prev"]){
				showPreviousLinkButton()
				previousPageLink.setAttribute("href", queryResults["_links"]["prev"])
				previousPageLink.addEventListener('click', navigateToPage)
			}
		}
	}

	function createSearchResultRow(resultStreamObject){
		var resultDiv = document.createElement("div")
		resultDiv.classList.add('row', 'w-100')
		return resultDiv
	}

	function createInfoBox(){
		var infoBox = document.createElement('div')
		infoBox.classList.add('info-box', 'pos-abs', 'mrg-left-20p', 'inline-b')
		return infoBox
	}

	function createThumbnailImage(resultStreamObject){
		var thumbnailUrl = resultStreamObject["preview"]["medium"]
		var thumbnailImage = new Image('180', '180')
		thumbnailImage.classList.add('thumbnail-img', 'inline-b')
		thumbnailImage.src = thumbnailUrl
		return thumbnailImage
	}

	function addStreamName(resultStreamObject){
		var streamName = document.createElement('h3')
		streamName.classList.add('mrg-top-0', 'pad-right-40p')
		streamName.innerText = resultStreamObject["channel"]["status"]
		return streamName
	}

	function addViewersCount(resultStreamObject){
		var viewersCount = document.createElement('p')
		viewersCount.innerText = resultStreamObject.game + ' - ' + resultStreamObject.viewers + ' viewers'
		return viewersCount
	}

	function addStreamDescription(resultStreamObject){
		var streamDescription = document.createElement('p')
		var channelName = resultStreamObject["channel"]["display_name"]
		var gameName = resultStreamObject["channel"]["game"]
		streamDescription.innerText = channelName + " playing " + gameName
		return streamDescription
	}

	function showPreviousLinkButton(){
		previousPageLink.style.display = "inline"
	}

	function hidePreviousLinkButton(){
		previousPageLink.style.display = "none"
	}

	function showNextLinkButton(){
		nextPageLink.style.display = "inline"
	}

	function hideNextLinkButton(){
		nextPageLink.style.display = "none"
	}


	function showResultsCount(){
		resultsMessage.style.display = "inline"
	}

	function hideResultsCount(){
		resultsMessage.style.display = "none"
	}

	function throwNoResultsMessage(){
		hidePageIndex()
		var noResultsMessage = document.createElement("p")
		noResultsMessage.innerText = "Sorry, we couldn't find anything. Try something else!"
		searchResultsList.appendChild(noResultsMessage)
	}

	function resetSearchBar(){
		searchBar.value = ""
	}

	function showPageIndex(){
		pageIndex.style.display = "inline"
	}

	function hidePageIndex(){
		pageIndex.style.display = "none"
	}

	function navigateToPage(event){
		event.preventDefault()
		clearSearchResultsList();
		var xmlhttp;
		if (window.XMLHttpRequest)
		  {// code for IE7+, Firefox, Chrome, Opera, Safari
		  xmlhttp =new XMLHttpRequest();
		  }
		else
		  {// code for IE6, IE5
		  xmlhttp =new ActiveXObject("Microsoft.XMLHTTP");
		  }
		xmlhttp.onreadystatechange=function()
		  {
		  if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
		    {

		    var queryResults = JSON.parse(xmlhttp.responseText)

		    updateResults(queryResults['_total'])

		    handlePagination(queryResults)

		    var streamResults = queryResults["streams"]
		    streamResults.forEach(function(result){
		    	var newRow = createSearchResultRow(result)
		    	searchResultsList.appendChild(newRow)
		    	newRow.appendChild(createThumbnailImage(result))
		    	var infoBox = createInfoBox();
		    	newRow.appendChild(infoBox)
		    	infoBox.appendChild(addStreamName(result))
		    	infoBox.appendChild(addViewersCount(result))
		    	infoBox.appendChild(addStreamDescription(result))
		    })
		    }
		  else if(xmlhttp.readyState == 4 && xmlhttp.status == 400){
		  	updateResults()
		  }

		  }  
		xmlhttp.open("GET", this.href, true)
		xmlhttp.send()
	}

})

