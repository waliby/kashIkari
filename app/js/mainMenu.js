var gestionMenu = {
	classCtnPart: ".ctnPartGestion",
	classBtnActif: ".btnActifGestion",
	active: function (idMenu) {
		$(this.classCtnPart + "[data-idMenu=\"" + idMenu + "\"]").css("display", "block");

	},
	hideAll: function () {
		$(this.classCtnPart).css("display", "none");
	},
	addFocusMenu: function () {

	}
};

//console.info(fs);
//console.info(process);
//$(function(){
var $btnHideMenu = $(".btnHideMenu, #fondOver"),
	$btnShowMenu = $("#btnShowMenu"),
	$fondOver = $("#fondOver"),
	$corp = $(".corp"),
	$menu = $(".menuLeft"),
	isMenuOpen = true,
	menuUl = $menu.find('ul'),
	menuWidth = menuUl.width();

$btnHideMenu.on("click", function () {
	if (!isMenuOpen) {
		$menu.addClass('menuLeftHide').delay(4000).removeClass('menuLeftShow');
		$btnShowMenu.addClass('showBtnMenu').delay(4000).removeClass('hideBtnMenu');
		$fondOver.toggleClass('flouCorp');

		isMenuOpen = !isMenuOpen;
	}
});

$btnShowMenu.on("click", function () {
	if (isMenuOpen) {
		$btnShowMenu.addClass('hideBtnMenu').delay(4000).removeClass('showBtnMenu');
		$menu.addClass('menuLeftShow').delay(4000).removeClass('menuLeftHide');
		$fondOver.toggleClass('flouCorp');

		isMenuOpen = !isMenuOpen;
	}
});

var idMenuStart = 1,
	lastBtnActif = null;

// Active(dévoile) le conteneur par defaut
gestionMenu.active(idMenuStart);

$(".ctnBtnCatAdd > span[data-idMenu=" + idMenuStart + "]").addClass("btnActifGestion");

$(".ctnBtnCatAdd > span").on("click", function () {
	var currentBtn = this,
		idMenu = currentBtn.getAttribute("data-idMenu");

	if (lastBtnActif != currentBtn) {
		$(".ctnBtnCatAdd > span").removeClass("btnActifGestion");
		$(currentBtn).addClass("btnActifGestion");

		gestionMenu.hideAll();
		gestionMenu.active(idMenu);
	}

	lastBtnActif = currentBtn;
});