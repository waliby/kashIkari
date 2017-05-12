/* global TYPE_TYPE */
/**
 * Created by waliby on 28.10.2015.
 */
var fs = null;
var electron, remote, app, mainApp, ncp, path, dialog;
try {
	electron = require('electron');
	//console.log(electron);
	remote = electron.remote;
	mainApp = app = remote.app;
	//console.log(remote)
	dialog = remote.dialog;
	// app = remote.require('app');
	// dialog = remote.require('dialog');
	// ncp = require('ncp');
	path = require('path');
	fs = require('fs-extra')
	//require('./function.js');§

	//BrowserWindow = remote.require('app');
} catch (e) {
	console.warn(e);
}


//console.info(dialog);

if (fs) {
	//const BrowserWindow = remote.BrowserWindow;
	/*
  console.log(fs);
  console.log(process);
  console.log(app.getAppPath() + "/../../");
  console.log(app.getName());
  console.log(app.getPath("appData"));
  console.log(app.getPath("userData"));
*/
	//console.log(app.getAppPath());
	//remote.getCurrentWindow.appendFile("test.txt", "salut \n");
	//console.warn(process);

	var pathApp = app.getAppPath();
	//console.warn(path.normalize(pathApp));

	var endPath = {
		fileZero: "/fileZero/",
		appUser: "/../dataUser/",
		appUserImg: "/../dataUser/imgUser/",
		fileOffline: "offline.json",
		fileInline: "inline.json",
		c: "imgUser/",
		noImg: "/img/mind_brain_thinking.png"
	};

	// Ne résout pas de probleme mais rend les chemin windows plus réaliste
	if (process.platform == "win32")
		pathApp = pathApp.replace(/\\/g, "\/");

	var pathFileZero = pathApp + endPath.fileZero,
		pathAppUser = pathApp + endPath.appUser,
		pathAppUserImg = pathAppUser + endPath.appUserImg,
		pathFileOffline = pathAppUser + endPath.fileOffline,
		pathFileInline = pathAppUser + endPath.fileInline,
		pathc = pathAppUser + endPath.c,
		pathNoImg = "file://" + pathApp + endPath.noImg;

	//console.log(path.normalize(pathNoImg)); // windows: Uncaught RangeError: The normalization form should be one of NFC, NFD, NFKC, NFKD.
	//console.log(path.normalize(pathNoImg));

	var TYPE_TYPE = "type",
		TYPE_AMIS = "amis",
		TYPE_PRET = "pret";

	// Capture des infos sur un chemin(fichier ou dossier)
	fs.stat(pathAppUser, function (err, stats) {
		//console.info(err);
		//console.warn(stats.isDirectory());
		// Si une erreur survient ou si ce n'est pas un dossier, on on entame le processus de creation.
		if (err || !stats.isDirectory()) {
			// Copie du conteue du répertoire fileZero dans dataUser
			fs.copy(pathFileZero, pathAppUser, function (errDir) {
				if (errDir) {
					return console.error(errDir);
				} else {
					remote.getCurrentWindow().reload();
					//menu.reload();
					return console.info("Copie du répertoire réussit.");
				}
			});
		} else {
			menu.reload();
			//dialog.showErrorBox("Message d'erreur", "Le dossier \"fileZero\" n'existe pas.");
		}
	});
} else {
	console.warn(pathNoImg);
}

var menu = {
	"reload": function () {
		/**
		  Capture les données du fichier offline.
		  Vérifie que le fichier existe.
		  Crée une list html avec les bon types.
		  Ajout de la liste dans le menu de gauche.
		*/
		if (!fs)
			var fs = require('fs');

		if (app.fileExist(pathFileOffline)) {
			fs.readFile(pathFileOffline, function (err, data) {
				var jsData = JSON.parse(data);

				if (jsData.hasOwnProperty("type")) {
					var tabType = jsData.type.value,
						strOut = '';

					for (var i = 0; i < tabType.length; i++) {
						var currType = tabType[i],
							pathImg;
						//console.warn(currType);
						if (currType.img)
							pathImg = '../dataUser/imgUser/' + currType.img;
						else
							pathImg = pathNoImg;

						if (currType.nom)
							strOut += `<li>
                            <a href="#" class="btnType" data-idType="` + currType.id + `">
                              <span class="menu_img" style="background-image: url('` + pathImg + `');"></span>
                              <span>` + currType.nom + `</span>
                            </a>
                          </li>`;
					}
					$("#ulMenuLeft").html(strOut);
					eventMenuLeft();
				}
			});
		} else
			dialog.showErrorBox("Message d'erreur", "Fichier offline.json introuvable.");
	}
};

function actuList(typeData, propriId, idLiaison, isActuSearch) {
	/**
	  -- fonction servant a actualiser le contenu des 3 type d'informations dans le programme.
	  idLiaison: facultatif, permet d'indiquer l'id d'un élément pour un critere de recherche,
	              Principallement utilisé pour les pret, affiché que ceux lier a un type
	*/
	//return false;
	console.log("event");
	fs.readFile(pathFileOffline, function (err, data) {
		if (err)
			return false;

		var jsData = JSON.parse(data);

		if (jsData.hasOwnProperty(typeData)) {
			var dataTab = jsData[typeData].value,
				tabTypeAmis = jsData[TYPE_AMIS].value,
				tabTypeType = jsData[TYPE_TYPE].value,
				strOut = '';

			// idLiaison -1 represente le bouton "tout", bouton qui doit afficher touts les prets.
			/*if(idLiaison && typeData == TYPE_PRET && idLiaison > -1){
			  var subTab = [];
			  for (var i = 0; i < dataTab.length; i++)
			    if(dataTab[i].idType == idLiaison)
			      subTab.push(dataTab[i]);
			  // Ecrasement du tableau du type de data choisir par celui trier
			  dataTab = subTab;
			}*/

			if (idLiaison && idLiaison > -1) {
				var subTab = [];
				for (var i = 0; i < dataTab.length; i++)
					if (dataTab[i][propriId] == idLiaison)
						subTab.push(dataTab[i]);
				// Ecrasement du tableau du type de data choisir par celui trier
				dataTab = subTab;
			}

			if (dataTab.length == 0)
				$(".ctnPret").html($("#lineNoPretInCat").clone());

			// Supprime tous les blocs amis de l'affichage si on demande d'actualiser l'affichage.
			// On ajoute ensuite les block 1 a 1 via append.
			if (isActuSearch)
				$(".ctnListSearch").html("");
			else {
				if (typeData == TYPE_AMIS)
					$(".ctnListAmis").html("");
				if (typeData == TYPE_TYPE)
					$(".ctnListType").html("");
			}

			for (var i = 0; i < dataTab.length; i++) {
				switch (typeData) {
					case TYPE_AMIS:
						var currObj = dataTab[i],
							ctnListAmis = '';

						// Actualise la liste d'amis dans la partie gestion et les amis
						// afficher dans la partie "liste amis"
						if (currObj && currObj.surnom) {
							strOut += `<option value="` + currObj.id + `">
                                ` + currObj.surnom + `:&nbsp;&nbsp;&nbsp` + currObj.nom + " " + currObj.prenom + `
                            </option>`;


							ctnListAmis += `<div class="blockAmis">
                                  <div class="ctnBtn" data-idAmis="` + currObj.id + `">
                                    <a href="javascript:void(0);" name="button" class="btnUpdateAmis">Modifier</a>
                                    <a href="javascript:void(0);" name="button" class="btnDelAmis">Supprimer</a>
                                  </div>
                                  <div class="ctnDataUser">
                                    <span>Nom:</span>
                                    <span class="spanValueAmis_nom">` + currObj.nom + `</span>
                                  </div>
                                  <div class="ctnDataUser">
                                    <span>Prenom:</span>
                                    <span class="spanValueAmis_prenom">` + currObj.prenom + `</span>
                                  </div>
                                  <div class="ctnDataUser">
                                    <span>Surnom:</span>
                                    <span class="spanValueAmis_surnom">` + currObj.surnom + `</span>
                                  </div>
                                  <div class="ctnBtn ctnBtnSave" data-idAmis="` + currObj.id + `">
                                    <a href="javascript:void(0);" name="button" class="btnValideUpdateAmis lienValide">Sauvegarder</a>
                                  </div>
                                </div>`;
						}

						if (isActuSearch)
							$(".ctnListSearch").append(ctnListAmis); // Ajoute a chaque tour de boucle un block d'amis
						else {
							$(".listAmis").html(strOut); // Ajoute a chaque tout tous le conteneur d'options.
							$(".ctnListAmis").append(ctnListAmis); // Ajoute a chaque tour de boucle un block d'amis
						}
						break;
					case TYPE_TYPE:
						var currObj = dataTab[i],
							ctnListType = "";

						if (currObj.nom)
							strOut += '<option value="' + currObj.id + '">' +
							currObj.nom +
							'</option>';

						var pathImg = "";
						if (currObj.img)
							pathImg = 'background-image: url(\'../dataUser/imgUser/' + currObj.img + `'); `;

						ctnListType = `<div class="lineType">
                                <div class="ctnModifImg">
                                  <span class="spanHackHeight"> </span>
                                  <span>Deplacer votre fichier ici
                                    <div class="ctnAffiNameImg" data-pathimg="">

                                    </div>
                                  </span>
                                </div>
                                <div class="imgCoverType` + (currObj.img ? " imgCoverTypePerso" : "") + `" style="` + pathImg + `" >

                                </div>
                                <div class="ctnRightType">
                                  <div class="titreType">` + currObj.nom + `</div>
                                  <div class="ctnBtnType" data-idType="` + currObj.id + `">
                                    <a href="#" class="btnUpdateType">Modifier</a>
                                    <a href="#" class="btnDelType">Supprimer</a>
                                  </div>
                                  <div class="ctnBtn ctnBtnSave" data-idType="` + currObj.id + `">
                                    <a href="javascript:void(0);" name="button" class="btnValideUpdateAmis lienValide">Sauvegarder</a>
                                  </div>
                                </div>
                              </div>`;

						if (isActuSearch)
							$(".ctnListSearch").append(ctnListType); // Ajoute a chaque tour de boucle un block d'amis
						else {
							$(".listPret").html(strOut);
							$(".ctnListType").append(ctnListType); // Ajoute a chaque tour de boucle un block d'amis
						}
						break;
					case TYPE_PRET:
						/*
						  "id": 14,
						  "posType": "1",
						  "posAmis": "3",
						  "description": "Pret de dvd",
						  "dateCreate": "10.11.2015",
						  "dateRecup": "12.12.2015",
						  "qte": "2",
						  "tabTypeInfo": ["jimbo", "coleftif"]
						*/
						var currObj = dataTab[i];
						if (currObj.idType >= 0 && currObj.idAmis >= 0) {
							//console.warn(currObj);

							// Récupere les data de l'amis concerné par le partage
							var affiAmis = "Amis surement supprimer.";
							var tabObjAmis = file.getById(TYPE_AMIS, currObj.idAmis, tabTypeAmis);

							if (tabObjAmis)
								affiAmis = tabObjAmis.surnom;

							// Récupere les data du type concerné par le partage
							var affiType = "Type surement supprimer.";
							var tabObjType = file.getById(TYPE_TYPE, currObj.idType, tabTypeType);

							if (tabObjType)
								affiType = tabObjType.nom;



							// Création de la chaine contenant les infos sur les éléments partager.
							var strTypeInfo = "";
							if (currObj.hasOwnProperty("tabTypeInfo") && currObj.tabTypeInfo.length > 0)
								for (var v = 0; v < currObj.tabTypeInfo.length; v++) {
									var currTypeinfo = currObj.tabTypeInfo[v];
									strTypeInfo += `<li><span>` + currTypeinfo + `</span></li>`;
								}

							var isDateWarning = false;
							var dateCreateUS = currObj.dateCreate.replace(/(\d{1,2})\.(\d{1,2})\.(\d{1,4})/gi, '$2.$1.$3'),
								dateRecupUS = currObj.dateRecup.replace(/(\d{1,2})\.(\d{1,2})\.(\d{1,4})/gi, '$2.$1.$3');

							//alert(new Date(dateCreateUS).getTime() + " - " + new Date(dateRecupUS).getTime());
							//console.log(Date.parse(currObj.dateRecup));

							// Comparaison sur le datetime UNIX
							if (dateCreateUS > dateRecupUS && currObj.dateCreate.length == currObj.dateRecup.length)
								isDateWarning = true;

							strOut += `<div class="ctnShare ` + (isDateWarning ? "effetWarningPretBorder" : "") + `">
                            <div id="ctnBtnPret" data-idPret="` + currObj.id + `">
                              <a href="javascript:void(0);" class="btnDelPret">Supprimer</a>
                            </div>
                            <div class="ctnImgShare">
                                <div>
                                    <img src="` + pathNoImg + `" alt="" />
                                </div>
                                <span class="spanHackHeight"> </span>
                            </div>
                            <div class="ctnRightShare">
                                <div class="ctnTitreShare ` + (isDateWarning ? "effetWarningPret" : "") + `">
                                    <span>
                                      Partage de ` + currObj.qte + ` «` + affiType + `» à <a href="">` + affiAmis + `</a>
                                    </span>
                                    <div class="ctnDateRight">
                                      <div><span>Prêté le</span>  ` + currObj.dateCreate + `</div>
                                      <div><span>A rendre le</span> ` + currObj.dateRecup + `</div>
                                    </div>
                                    <!--<span>Prêter le ` + currObj.dateCreate + `</span>-->
                                </div>
                                <div class="ctnDescriShare">
                                  ` + currObj.description + `
                                  <ul class="listInfoPret">
                                    ` + strTypeInfo + `
                                  </ul>
                                </div>
                            </div>
                        </div>`;

							if (isActuSearch)
								$(".ctnListSearch").append(strOut); // Ajoute a chaque tour de boucle un block d'amis
							else
								$(".ctnPret").html(strOut);
						}
						break;
				}
			}
			if (typeData === TYPE_PRET)
				eventListPret();
		}
		if (typeData === TYPE_AMIS)
			eventListAmis();
		if (typeData === TYPE_TYPE)
			eventListType();
	});
}

// Completition des listes déroulante.
actuList(TYPE_AMIS);
actuList(TYPE_TYPE);
actuList(TYPE_PRET);

var file = {
	"getLastId": function (typeData) {
		var obj = this.getJson(pathFileOffline),
			lastIdInsered = null;

		if (obj.hasOwnProperty(typeData))
			lastIdInsered = obj[typeData].primaryKey;


		if (lastIdInsered >= 0)
			//return tabType[tabType.length-1].id;
			return lastIdInsered;
		else
			return -1;
	},
	"getById": function (typeData, idElement, tabType) {
		// Si le tableau n'est pas renseigner, on le capture dans le fichier
		if (typeof tabType === "undefined") {
			var obj = this.getJson(pathFileOffline);

			if (obj.hasOwnProperty(typeData))
				tabType = obj[typeData].value;
		}

		for (var i = 0; i < tabType.length; i++) {
			if (tabType[i].id == idElement)
				return tabType[i];
		}

		return 0;
	},
	"isFileExist": function (pathFile, callback) {
		/**
		  Vérifie que le fichier existe, s'il existe,
		  on ajoute les nouvelles data avec addJson
		*/
		//var self = this;
		if (!pathFile)
			return false;

		fs.stat(pathFileOffline, function (err, stats) {
			console.info(err);
			// Si une erreur survient ou si ce n'est pas un dossier, on on entame le processus de creation.
			if (!err && stats.isFile()) {
				//console.log(self);
				callback();
			} else {
				dialog.showErrorBox("Message d'erreur", "Fichier offline.json introuvable.");
				// Copie du fichier uniquement.
				fs.createReadStream(pathFileOffline).pipe(fs.createWriteStream(pathFileOffline));
			}
		});
	},
	"update": function (typeData, id, objData, callbackSuccess) {
		/**
		  Met a jour une information du fichier json en fonction
		  de l'id recu en parametre.

		  objData est un json contenant les infos a mettres a jour,
		    exemple: {"img": newImgPath}
		*/
		if (!id || typeof objData != "object")
			return false;

		var obj = this.getJson(pathFileOffline),
			tabType = obj[typeData].value;

		//console.info(tabType);
		//console.info(id);

		//if(tabType.length < id)
		//  return false;

		// Capture l'élément correspondant a l'id recu.
		var type = null;
		for (var i = 0; i < tabType.length; i++) {
			if (tabType[i].id == id)
				type = tabType[i]; // Passage de référence
		}

		var objAvantModif = JSON.parse(JSON.stringify(type));

		// Si l'id n'existe pas dans le tableau de type choisit, on retourne false.
		if (!type)
			return false;

		if (typeData === TYPE_TYPE) {
			if (objData.hasOwnProperty("nom"))
				type.nom = objData.nom;

			if (objData.hasOwnProperty("img")) {
				type.img = objData.img;
				//if(app.isImg(objData.img))
				//  app.addImg(id, objData.img); // Appel de addImg dans "update"
			}
			if (objData.hasOwnProperty("imgOrigin")) {
				type.imgOrigin = objData.imgOrigin;
				//if(app.isImg(objData.img))
				//  app.addImg(id, objData.img); // Appel de addImg dans "update"
			}
		}

		if (typeData === TYPE_AMIS) {
			if (objData.hasOwnProperty("nom"))
				type.nom = objData.nom;
			if (objData.hasOwnProperty("prenom"))
				type.prenom = objData.prenom;
			if (objData.hasOwnProperty("surnom"))
				type.surnom = objData.surnom;
		}

		obj[typeData].value = tabType;
		//console.warn("->>>");
		//console.warn(type);

		fs.writeFile(pathFileOffline, JSON.stringify(obj), 'utf8', function (err) {
			if (err) {
				throw err;
				return false;
			};
			console.log('Fichier updater !');
			if (typeof callbackSuccess == "function")
				// tabType == objBeforeModif dans l'idée
				callbackSuccess(objAvantModif);
			menu.reload();
		});
	},
	"getJson": function (pathFile, typeData) {
		/**
		  Capture le contenue du fichier offline
		  Retourne l'object json.
		*/
		if (!pathFile) {
			console.warn("Chemin non valide.");
			return false;
		} else {
			var jsonOut = JSON.parse(fs.readFileSync(pathFile));

			// Si le parametre indiquant le type de donnée souhaiter existe
			// et que la donnée voulu existe aussi, on retourne le tableau voulu.
			if (typeData && jsonOut.hasOwnProperty(typeData))
				jsonOut = jsonOut[typeData];

			return jsonOut;
		}
	},
	"addJson": function (typeData, post, callback) {
		/**
		  Capture du json placé dans le fichier offline
		  Ajout au fichier du nouveau type
		  Ecriture du json dans la fichier offline

		  Post: new object json to add for value
		*/
		var obj = this.getJson(pathFileOffline),
			objType = obj[typeData],
			tabTypeVal = objType.value;
		//idNewInsert = tabType.length;

		var newObj = {};
		// newObj.id = ++idNewInsert;
		for (var param in post) {
			if (post.hasOwnProperty(param)) {
				newObj[param] = post[param];
			}
		}

		// Création du nouveau id et ajout au nouveau au nouveau élément
		if (typeof objType.primaryKey != "undefined") {
			var newId = ++objType.primaryKey;
			newObj.id = newId;

			// Ajout de l'incrementation de la clef primaire
			objType.primaryKey = newId;
		}

		// Ajout du nouvelle élément au tableau de l'object principal
		if (typeof objType.value != "undefined")
			objType.value.push(newObj);
		else
			// For the situation of "setting" is the typeData
			objType = newObj;

		/*
		tabType.push({
		  id: ++idNewInsert,
		  nom: post.nom,
		  img: post.pathImg
		});*/

		obj[typeData] = objType;

		console.warn(obj);
		fs.writeFile(pathFileOffline, JSON.stringify(obj), 'utf8', function (err) {
			if (err) {
				throw err;
				return false;
			};
			console.log('Info Ajouté au fichier !_1');

			callback();
			menu.reload();
			return true;
		});
	},

	"delObj": function (typeData, nomChampId, id, obj) {
		/**
		  Capture du json placé dans le fichier offline
		  Suppression des l'objects json en fonction de l'id passé en parametre
		  ( Si le type de donnée a supprimer est TYPE_AMIS, on doit supprimer tous les prets au quel l'amis est lier. )
		  ( Le parametre "obj" ne contient rien au moment de l'appel, il est utiliser en interne (récursion) pour continuer a modifier l'object en cour )
		  Ecriture du json dans la fichier offline
		*/
		var isRecustion = false;

		if (typeof obj === "undefined") {
			obj = this.getJson(pathFileOffline);
		} else {
			isRecustion = true;
		}

		var tabData = obj[typeData].value,
			tabPosObjInBigObj = [];

		//console.warn("info: " + posObjInBigObj);
		//console.warn(tabData);
		//return false;

		var newTab = [];
		// Cherche la position de l'object par l'id recu
		for (var i = 0; i < tabData.length; i++) {
			var currObj = tabData[i];
			if (currObj.hasOwnProperty(nomChampId) && currObj[nomChampId] != id) {
				//if(typeData === TYPE_AMIS)
				//console.warn(currObj);
				//tabPosObjInBigObj.push(i);
				newTab.push(currObj)
			} else if (typeData == TYPE_TYPE) {
				if (currObj.hasOwnProperty("img"))
					app.delImg(currObj.img);
			}
		}
		// En remplace les valeurs du json par les valeurs que nous voulons garder
		tabData = newTab;

		// Doit étre vant la récursive pour garder l'actualisation.
		// Ecrase les anciennces valeur par la selection de nouvelle.
		obj[typeData].value = tabData;

		/*
		var newTab = [];
		// On supprime l'element précedement trouvé si la position existe.
		for (var i = 0; i < tabPosObjInBigObj.length; i++) {
		  console.warn(tabData);
		  if(!(tabPosObjInBigObj[i] in tabData)){
		    newTab.push();
		    if(typeData === TYPE_PRET)
		    console.warn("Suppresison: " + tabPosObjInBigObj[i]);
		    //delete tabData[posObjInBigObj]; // ECMA6, remplace la valeur par null
		    tabData.splice(tabPosObjInBigObj[i], 1);
		  }
		}*/

		// LA METHODE DOIT S'APPELER ELLE MéME DANS LE CAS DE LA SUPPRESSION D'UN AMIS, IL FAUT SUPPRIMER LES PRETS LIER AU AMIS
		if (typeData === TYPE_AMIS) {
			// On passe l'object actuel en parametre pour la modification.
			file.delObj(TYPE_PRET, "idAmis", id, obj);
		}

		// LA METHODE DOIT S'APPELER ELLE MéME DANS LE CAS DE LA SUPPRESSION D'UN TYPE, IL FAUT SUPPRIMER LES PRETS LIER AU TYPE
		if (typeData === TYPE_TYPE) {
			// On passe l'object actuel en parametre pour la modification.
			file.delObj(TYPE_PRET, "idType", id, obj);
		}

		// On place le tableau modifier dans l'object json global
		//  obj[typeData].value = tabData;
		// On remplace l'object json global si la fonction n'a pas été appeler de magniere récursive.
		console.warn(isRecustion);

		if (!isRecustion) {
			console.log(obj);
			fs.writeFile(pathFileOffline, JSON.stringify(obj), 'utf8', function (err) {
				if (err) {
					throw err;
					return false;
				};
				console.log('Info Ajouté au fichier !');

				return true;
			});
		}
	}
};


var app = {
	"defaultLng": "en",
	"defautltTitle": "kashIkari",
	"fileExist": function (pathFile) {
		/**
		  Vérifie que le fichier existe de magniere synchrome.
		*/
		var stats = fs.statSync(pathFile);

		if (stats.isFile()) {
			return true;
		}
		return false;
	},
	"isImg": function (pathImg) {
		/**
		  Vérifie que le chemin de l'image est un chemin valid.
		  Vérifie que l'extension de l'image est un type accepter.
		*/
		console.warn(pathImg);
		if (pathImg && /[\w\\/\.]{3,}/ig.exec(pathImg)) {
			if (/[\.png|\.jpg|\.gif]$/ig.exec(pathImg)) {
				return true;
			} else
				dialog.showErrorBox("Message d'erreur", "Seul les formats d'image suivant sont autorisé: [.png|.jpg|.gif]");
		} else
			console.info("Chemin de l'image non valide ou vide.");
		return false;
	},
	"addImg": function (lastInsertId, pathImg, callbackUpdate) {
		//alert("une fois ");
		var d = new Date(),
			imgValided = imgAdded = false;

		// Découpe le chemin de l'image pour garder l'extension
		var tabPath = path.parse(pathImg);
		// Crée le chemin d'enregistrement de la copie de l'image avec le nom généré.
		var newImgPath = d.getTime() + tabPath.ext,
			fullName = tabPath.base;

		// Copie de l'image
		console.warn(pathImg);
		console.warn(pathAppUserImg + newImgPath);
		fs.copy(pathImg, pathAppUserImg + newImgPath, function (err) {
			if (err) {
				return console.error(err);
			} else {
				console.log("Ajout de l'image réussit.");
				pathImg = null;
				// Ajout du chemin de l'image dans le fichier json
				/*console.warn(newImgPath);
				file.update(TYPE_TYPE, lastInsertId, {
				  "img": newImgPath
				});*/
				callbackUpdate(newImgPath, fullName);
			}
		});
	},
	"delInfo": function (typeData, idObj, propertyDel, pathImg, callbackUpdate) {
		var obj = file.getJson(pathFileOffline);

		if (!obj.hasOwnProperty(typeData))
			return false;

		var tabType = obj[typeData].value;

		for (var i = 0; i < tabType.length; i++) {
			if (tabType[i].id == idObj)
				fs.unlink(pathAppUserImg + tabType[i][propertyDel], (err) => {
					if (err) throw err;
					console.log('successfully deleted: ' + pathAppUserImg + tabType[i][propertyDel]);
				});
		}
	},
	"delImg": function (nomImg) {
		console.info("Tentative de suppression.");

		if (app.isImg(nomImg))
			fs.unlink(pathAppUserImg + nomImg, (err) => {
				if (err) throw err;
				console.log('successfully deleted: ' + pathAppUserImg + nomImg);
			});
	},
	"getSetting": (typeData) => {
		var obj = file.getJson(pathFileOffline),
			setting = obj[typeData];
		console.log(obj);
		return setting;
	},
	"setSetting": (typeData, objPropVal) => {
		/**
		 * Modify all property from setting founded in objPropVal with the new value from objPropVal
		 */

		if(typeof objPropVal != "object")
			return false;

		var obj = file.getJson(pathFileOffline),
			setting = obj[typeData];

		for (var key in setting) {
			if (setting.hasOwnProperty(key) && objPropVal.hasOwnProperty(key)) {
				
				setting[key] = objPropVal[key];
			}
		}

		file.addJson("setting", setting, () => {
			console.info("New setting writed in thesetting file.");
			app.actuLng();
		});


		return setting;
	},
	"getLng": (callback) => {
		var settings = app.getSetting("setting");

		if(settings && typeof settings.defaultLng != "undefined" && settings.defaultLng != this.defaultLng){
			this.defaultLng = settings.defaultLng;

			// Change language of all component of the application
			/*if(Object.keys(i18next.store.data).indexOf(this.defaultLng) == -1)*/
				i18next.loadLanguages(this.defaultLng, (err, t) => {
					i18next.changeLanguage(this.defaultLng);

					if(typeof callback == "function")
						callback();
				});
			/*else
				i18next.loadNamespaces('translation', (err, t) => {
					i18next.changeLanguage(this.defaultLng);
				});*/
		}

		return this.defaultLng;
	},
	"actuLng": () => {
		// Get current language by property overwrited by user config (in offline.json) and actualise vue.
		app.getLng(() => {
			$("body *").localize();
		});
	}
};


/**
 *	Cette object est le premier demander, il fait les tests de sécurité puis on appel
 *  les methodes necessaire pour la sauvegarde.
 */
var submit = {
	type: {
		"add": function (form, callback) {
			/**
			  Vérifie que le nom du type est un nom valide.
			  Ajoute le nom au fichier json.
			  Si l'image existe, on la copie dans le dossier.
			*/

			var etatCtrl = control.type(form);

			if (!etatCtrl.success) {
				dialog.showErrorBox("Message d'erreur", etatCtrl.msgError);
				return false;
			}

			file.isFileExist(pathFileOffline, function () {
				// Les key doivents correspondre parfaitement au key figurant dans le fichier offline.
				// les véritabe key ajouté dans le fichier sont indiquer ici.

				file.addJson(TYPE_TYPE, form, function () {

					var lastInsertId = file.getLastId("type");

					if (isNaN(lastInsertId)) {
						console.warn("Erreur d'insertion du nom.");
						return false;
					}

					if (form.hasOwnProperty("img") && app.isImg(form.img))
						if (app.fileExist(form.img)) {
							app.addImg(lastInsertId, form.img, function (nameImg, fullName) {

								file.update(TYPE_TYPE, lastInsertId, {
									"img": nameImg,
									"imgOrigin": fullName
								}, function () {
									callback();
									dialog.showMessageBox({
										type: "info",
										title: "Succès",
										message: "Ajout réussit",
										detail: "L'ajout du type « " + form.nom + " » ajouté avec succès.",
										buttons: ["OK"]
									});
								});
							});
						} else
							dialog.showErrorBox("Message d'erreur", "Fichier offline.json introuvable.");
					else {
						callback();
						dialog.showMessageBox({
							type: "info",
							title: "Succès",
							message: "Ajout réussit",
							detail: "L'ajout du type  « " + form.nom + " » ajouté avec succès.",
							buttons: ["OK"]
						});
						console.warn("Le fichier doit étre une img");
					}
				});
			});
		}
	},
	amis: {
		"add": function (form, callback) {
			/**
			  Vérifie que le nom du type est un nom valide.
			  Ajoute le nom au fichier json.
			*/
			var etatCtrl = control.amis(form);

			if (!etatCtrl.success) {
				dialog.showErrorBox("Message d'erreur", etatCtrl.msgError);
				return false;
			} else {
				file.isFileExist(pathFileOffline, function () {
					// Les key doivents correspondre parfaitement au key figurant dans le fichier offline.
					// les véritabe key ajouté dans le fichier sont indiquer ici.
					file.addJson(TYPE_AMIS, form, function () {
						dialog.showMessageBox({
							type: "info",
							title: "Succès",
							message: "Ajout réussit",
							detail: "L'ajout de l'amis " + form.surnom + " ajouté avec succès.",
							buttons: ["OK"]
						});
						callback();
					});
				});
			}
		}
	},
	pret: {
		"add": function (form, callback) {
			/**
			  Vérifie que le nom du type est un nom valide.
			  Ajoute le nom au fichier json.
			*/
			var etatCtrl = control.pret(form);

			// Ne garde que les éléments du tableau avec un valeur pleine.
			if (typeof form.tabTypeInfo == "object") {
				var valInTabExisted = false,
					tabVerified = [],
					msgErrorInfo = "";

				form.tabTypeInfo.forEach(function (currentVal, index) {
					if (/[\w\s]{3,}/ig.exec(currentVal)) {
						tabVerified.push(currentVal);
						valInTabExisted = true;
					}
				});

				// On place l'eventuel erreur que si aucune valeur n'a été trouvé ou ne correspond.
				if (!valInTabExisted) {
					etatCtrl.msgError += "\nLes champs d'information doivent avoir au moin 3 caracteres.";
					etatCtrl.success = false;
				}

				// Remplace le tableau d'info recu par le nouveau contenant des valeurs remplit.
				form.tabTypeInfo = tabVerified;
			}

			if (!etatCtrl.success) {
				dialog.showErrorBox("Message d'erreur", etatCtrl.msgError);
				return false;
			} else {
				file.isFileExist(pathFileOffline, function () {
					// Les key doivents correspondre parfaitement au key figurant dans le fichier offline.
					// les véritabe key ajouté dans le fichier sont indiquer ici.
					file.addJson(TYPE_PRET, form, function () {
						dialog.showMessageBox({
							type: "info",
							title: "Succès",
							message: "Enregistrement réussit.",
							detail: "Le pret est maintenant accesible facilement sur votre interface.",
							buttons: ["OK"]
						});
						callback();
					});
				});
			}
		}
	}
};

var control = {
	type: function (form) {
		var errorFinded = false,
			msgError = "";
		// Le nom est obligatoire, on ne fait rien sans nom.
		if (!form.nom || !/[\w\s]{3,}/ig.exec(form.nom)) {
			msgError = "Vous devez indiquer un nom de type. [min: 3 caractères]";
			errorFinded = true;
		}

		return {
			success: !errorFinded,
			"msgError": msgError
		};
	},
	amis: function (form) {
		var errorFinded = false,
			msgError = "";

		if (form.nom && !/[\w\s]{3,}/ig.exec(form.nom)) {
			msgError = "Vous devez indiquer un nom de votre amis. [min: 3 caractères]";
			errorFinded = true;
		}

		if (form.prenom && !/[\w\s]{3,}/ig.exec(form.prenom)) {
			msgError += "\nVous devez indiquer un prenom de votre amis. [min: 3 caractères]";
			errorFinded = true;
		}

		// Le surnom n'est pas obligatoire
		if (!form.surnom || !/[\w\s]{3,}/ig.exec(form.surnom)) {
			msgError += "\nVous devez indiquer le surnom de votre amis. [min: 3 caractères]";
			errorFinded = true;
		}

		return {
			success: !errorFinded,
			"msgError": msgError
		};
	},
	pret: function (form) {
		var errorFinded = false,
			msgError = "";

		if (form.idType == undefined || !/^\d{1,}$/i.exec(parseInt(form.idType))) {
			msgError = "Erreur d'identifiant pour le champ de prêt.";
			errorFinded = true;
		}

		if (form.idAmis == undefined || !/^\d{1,}$/ig.exec(parseInt(form.idAmis))) {
			msgError += "\nErreur d'identifiant pour le champ d'amis.";
			errorFinded = true;
		}

		if (!form.qte || !/^\d{1,}$/ig.exec(parseInt(form.qte)) || form.qte == 0 || form.qte >= 10) {
			msgError += "\nErreur dans le champ de quantité [1-10].";
			errorFinded = true;
		}

		if (!form.tabTypeInfo) {
			msgError += "\nAucune information sur le partage n'a été fournit.";
			errorFinded = true;
		}

		var dateCreateUS = form.dateCreate.replace(/(\d{1,2})\.(\d{1,2})\.(\d{1,4})/gi, '$2.$1.$3'),
			dateRecupUS = form.dateRecup.replace(/(\d{1,2})\.(\d{1,2})\.(\d{1,4})/gi, '$2.$1.$3');

		// Controle de la date, celle de recup ne doit pas étre plus grande.
		if (dateCreateUS > dateRecupUS) {
			msgError += "\nLa date de récupération doit étre plus grande que la date de création du prêt.";
			errorFinded = true;
		}

		return {
			success: !errorFinded,
			"msgError": msgError
		};
	}
};


/**
  -- Gestion des Event
*/
var $btnPlus = $("#btnReload");
$btnPlus.on("click", function () {
	//alert("ok");
	//fs.appendFile('message.txt', 'data to append\n', 'utf8');
	remote.getCurrentWindow().reload();
	event.preventDefault();
});




var vitesse = 400;

//$(".btnType").eq(0).toggleClass("focusedType");

$("#btnAddPret").on("click", function () {
	$(this).addClass("btnAddPretEffet");
	event.preventDefault();
});


var $formType = $("#formType"),
	$formAmis = $("#formAmis"),
	$formPret = $("#formPret"),
	$nomType = $("#nomAddTypeNom"),
	nomTypeVal = pathImg = null;

$formType.on("submit", function (event) {
	nomTypeVal = $nomType.val();

	submit.type.add({
		"nom": nomTypeVal,
		"img": pathImg
	}, function () {
		document.getElementById("formType").reset();
		pathImg = null;
		actuList(TYPE_TYPE);
	});

	event.preventDefault();
});

$formAmis.on("submit", function (event) {

	var objForm = $(this).serializeArray(),
		nom = objForm[0].value,
		prenom = objForm[1].value,
		surnom = objForm[2].value;

	submit.amis.add({
		"nom": nom,
		"prenom": prenom,
		"surnom": surnom
	}, function () {
		document.getElementById("formAmis").reset();
		actuList(TYPE_AMIS);
	});

	event.preventDefault();
});

$formPret.on("submit", function (event) {
	//console.log(document.getElementById("formPret").elements["idPret"].value);
	//console.log(document.getElementById("formPret").elements);

	var formP = document.getElementById("formPret").elements,
		idType = formP["idType"].value,
		qte = formP["qte"].value,
		tabTypeInfo = null,
		idAmis = formP["idAmis"].value,
		descri = formP["descri"].value,
		dateR = formP["dateRecu"].value;

	if (formP.hasOwnProperty("tabTypeInfo")) {
		tabTypeInfo = formP["tabTypeInfo"];

		// Construit un tableau contenant les valeurs des "info" du type choisit
		var tabInfoQte = [];
		if (tabTypeInfo.nodeName != undefined)
			tabInfoQte.push(tabTypeInfo.value);
		else {
			for (var varr in tabTypeInfo) {
				if (tabTypeInfo.hasOwnProperty(varr)) {
					tabInfoQte.push(tabTypeInfo[varr].value);
				}
			}
		}
	}

	var d = new Date(),
		dateCrea = getDate(d) + "." + getMonth(d) + "." + d.getFullYear();

	// parseInt retourne NaN si ce n'est pas un nombre, les teste suivant permettre d'empecher l'enregistrement
	submit.pret.add({
		"idType": parseInt(idType),
		"idAmis": parseInt(idAmis),
		"description": descri,
		"dateCreate": dateCrea,
		"dateRecup": dateR,
		"qte": parseInt(qte),
		"tabTypeInfo": tabInfoQte
	}, function () {
		document.getElementById("formPret").reset();
	});

	event.preventDefault();
});



var listPret = $(".listPret"),
	inpNbr = $(".input_nbr"),
	tplLine = $(".lineSupInfo").clone(),
	ctnLine = $(".ctnLine"),
	typeNom = null,
	isFirstTime = true; // Permet de capturer le premier élément au mooment de la pression d'une touche dans la zone qte

inpNbr.on("keyup", function (event) {
	var nbr = $(this).val();

	// Resset toutes les lignes eventuellement générer par un precedent ajout dans le champ qte
	ctnLine.html("");
	if (!/\d{1,}/i.exec(nbr)) {
		return false;
	}

	// Permet de capturer le premier nom dans la liste si aucun élément n'a été selectionner dans la liste.
	if (isFirstTime && !typeNom) {
		typeNom = listPret.children().eq(0).html();
		isFirstTime = false;
	}

	// Un des deux limite du nombre d'entré
	if (nbr > 10)
		nbr = 10;

	for (var i = 0; i < nbr; i++) {
		var currLine = tplLine.clone();
		currLine.children("label").append(" <span class=\"typeNom\">« " + typeNom + " »</span> " + (i + 1) + ":");
		currLine.children("input").attr("name", "tabTypeInfo");
		ctnLine.append(currLine.get(0));
	}

	ctnLine.children().show();
});

listPret.on("change", function (event) {
	/**
	  Permet de carger le nom de l'élément nouvellement selectionner.
	*/

	var listDom = $(listPret).get(0);
	var typeNom = listDom.options[listDom.selectedIndex].text;

	//console.warn("change nom: " + typeNom);
	$(".typeNom").html("« " + typeNom + " »");
});

// Fait disparaitre le contenu actuellement affiché et affiche le
// block contenant les amis.
var $ctnAmis = $(".ctnAmis"),
	$ctnType = $(".ctnType");
	//isFnAmisOpen = false,
	//isFnTypeOpen = false;

var $currentFnOpen = null;

// catch the current open window,
$(".ctnPage").each((index, element) => {
	if($(element).css("display") == "block")
		$currentFnOpen = $(element);
});

/*
$(".btnShowFn").on("click", function (event) {
	var nomFn = $(this).attr("data-fn");

	if (nomFn == "amis") {
		isFnTypeOpen = false;

		if (isFnAmisOpen) {
			$ctnPret.fadeIn(vitesse);
			$ctnAmis.fadeOut(vitesse);
		} else {
			// Suppression des signes d'ouverture de la fenetre de gestion
			$("#btnAddPret").removeClass("btnAddPretEffet");
			isGestionOpen = false;

			hideFn();

			$ctnAmis.fadeIn(vitesse);
		}
		isFnAmisOpen = !isFnAmisOpen;

	} else if (nomFn == "type") {
		isFnAmisOpen = false;

		if (isFnTypeOpen) {
			$ctnPret.fadeIn(vitesse);
			$ctnType.fadeOut(vitesse);
		} else {
			// Suppression des signes d'ouverture de la fenetre de gestion
			$("#btnAddPret").removeClass("btnAddPretEffet");
			isGestionOpen = false;

			hideFn();

			$ctnType.fadeIn(vitesse);
		}
		isFnTypeOpen = !isFnTypeOpen;
	}

	event.preventDefault();
});*/


// Event for change of window
$(".btnShowFn").on("click", function (event) {
	let nomFn = $(this).attr("data-fn"),
		$newFn = $(".ctnPage[data-value='"+nomFn+"']");

	if(!$currentFnOpen.is($newFn)){
		// Actualyse view of loan cause maybe the user had just add some new in the gestion page.
		if(nomFn == "index")
			actuList(TYPE_PRET, -1);

		if(nomFn != "gestion")
			$("#btnAddPret").removeClass("btnAddPretEffet");


		$($newFn).fadeIn(vitesse);
		// Have to disapear faster than newFn appear
		$($currentFnOpen).fadeOut(0);

		$currentFnOpen = $newFn;
	}else
		console.log("This fn is already open.");

	event.preventDefault();
});


var isModUpdateOpen = false,
	currentElemOpen = null;

var $ctnPret = $(".ctnPret");

function eventMenuLeft() {

	$(".btnType").on("click", function (event) {

		var idType = $(this).attr("data-idtype"),
			currFocused = $(".focusedType").eq(0);

		if (!currFocused.is($(this))) {
			currFocused.removeClass("focusedType");
			$(this).toggleClass("focusedType");
		}

		// Si une fenetre autre que celle des pret est ouverte, on la ferme et on ouvre la fn de pret
		if ($currentFnOpen.attr("data-value") != "index") {
			hideFn();
			$ctnPret.fadeIn(vitesse);
		}

		if (!isNaN(parseInt(idType))) {
			actuList(TYPE_PRET, "idType", idType);
		} else
			console.warn("Erreur: L'id de l'élément du menu n'est pas valide.");

		event.preventDefault();
	});

}

function eventClicUpdate(typeData, classButton, classTop, attrIdElem, noeudModif) {
	//console.warn(currentElemOpen);

	$(classButton).on("click", function (event) {
		var idElem = $(this).parent().attr(attrIdElem);

		if (!isNaN(parseInt(idElem))) {
			// On enleve les input des élémens a modifier si on clique sur le bouton modifier d'un autre object
			if (currentElemOpen != this) { //  && currentElemOpen != null
				$(".inputUpdate").each(function (index, element) {
					$(element).parent().html($(element).val());
				});
				$(currentElemOpen).text("Modifier");
				isModUpdateOpen = false;
			}

			console.warn(isModUpdateOpen);
			$(this).text(isModUpdateOpen ? "Modifier" : "Annuler");

			var parentTop = $(this).parents(classTop),
				tCtn = [];

			noeudModif(tCtn, parentTop);

			// Si on change de bouton "modifier", on cache l'ancien bouton
			if (currentElemOpen != this) {
				$(currentElemOpen).parents(classTop).find(".ctnBtnSave").slideUp(vitesse);
				if (typeData == TYPE_TYPE) {
					$(currentElemOpen).parents(classTop).find(".ctnModifImg").slideUp(vitesse);
					$(currentElemOpen).parents(classTop).find(".imgCoverType").slideDown(vitesse);
				}
			} else {
				// Cache le bouton "modifier" quand il était afficher et qu'on reclique sur le bouton
				parentTop.find(".ctnBtnSave").slideUp(vitesse);
				if (typeData == TYPE_TYPE) {
					parentTop.find(".ctnModifImg").slideUp(vitesse);
					parentTop.find(".imgCoverType").slideDown(vitesse);
				}
			}

			if (!isModUpdateOpen) {
				parentTop.find(".ctnBtnSave").slideDown(vitesse);
				if (typeData == TYPE_TYPE) {
					parentTop.find(".ctnModifImg").slideDown(vitesse);
					parentTop.find(".imgCoverType").slideUp(vitesse);
				}
			}

			for (var i = 0; i < tCtn.length; i++) {
				tCtn[i].html(isModUpdateOpen ? tCtn[i].children().val() : '<input type="text" value="' + tCtn[i].text() + '" class="inputUpdate" />');
			}
		} else
			console.warn("Erreur: L'id de l'élément du menu n'est pas valide.");

		isModUpdateOpen = !isModUpdateOpen;
		currentElemOpen = this;

		event.preventDefault();
	});
}

function eventClickBtnSave(typeData, classButton, classTop, attrIdElem, noeudModif) {
	// Bouton de sauvegarde
	$(classButton).on("click", function (event) {
		var idElem = $(this).parent().attr(attrIdElem);

		if (!isNaN(parseInt(idElem))) {

			var parentTop = $(this).parents(classTop),
				tCtn = {};

			// fonction passé en argument pour ajouter les noeud au tableau tCtn
			noeudModif(tCtn, parentTop);
			//console.log(tCtn.img);


			var etatCtrl = control[typeData](tCtn);

			if (!etatCtrl.success) {
				dialog.showErrorBox("Message d'erreur", etatCtrl.msgError);
				return false;
			}

			// Ajout simple de nouvelle informations
			if (typeData != TYPE_TYPE || !app.isImg(tCtn.img)) {
				file.update(typeData, idElem, tCtn, function () {
					dialog.showMessageBox({
						type: "info",
						title: "Succès",
						message: "Mise a jour réussit",
						detail: "La mise a jour de l'amis " + tCtn.surnom + " effectué avec succès.",
						buttons: ["OK"]
					});
					actuList(typeData);
					hideLastModif();
				});
			} else {
				// 1) Ajout de la nouvelle image
				// 2) Mise a jour des infos de la nouvelle images
				// 3) Suppression de l'ancienne image.
				app.addImg(idElem, tCtn.img, function (newNomImg, fullName) {
					tCtn.img = newNomImg;
					tCtn.imgOrigin = fullName;
					file.update(typeData, idElem, tCtn, function (objBeforeModif) {
						// Callback de success
						// Suppression de l'ancienne image.
						console.log(objBeforeModif);
						if (objBeforeModif.hasOwnProperty("img"))
							app.delImg(objBeforeModif.img);

						$(parentTop).find(".imgCoverType").attr("style", "display: none; background-image: url('../dataUser/imgUser/" + tCtn.img + "');");

						dialog.showMessageBox({
							type: "info",
							title: "Succès",
							message: "Mise a jour réussit",
							detail: "La mise a jour de l'amis " + tCtn.surnom + " effectué avec succès.",
							buttons: ["OK"]
						});
						actuList(typeData);
						hideLastModif();

						// Enleve l'effet de flou sur l'image
						$(parentTop).find(".imgCoverType").addClass("imgCoverTypePerso");
					});
				}); // Appel de addImg dans "update"
			}
		} else
			console.warn("Erreur: L'id de l'élément de sauvegarde n'est pas valide.");

		event.preventDefault();
	});
}

function hideLastModif() {
	$(".inputUpdate").each(function (index, element) {
		$(element).parent().html($(element).val());
	});
	$(currentElemOpen).text("Modifier");
	isModUpdateOpen = false;

	$(".ctnBtnSave").slideUp(vitesse);
	$(".ctnModifImg").slideUp(vitesse);
	$(currentElemOpen).parents(".lineType").find(".imgCoverType").slideDown(vitesse);
}

function eventClickUpdate() {

}


function eventListAmis() {

	clickDelElem(".btnDelAmis", TYPE_AMIS, "data-idAmis", function () {
		// On actualise a nouveau la liste d'amis
		actuList(TYPE_AMIS);
		actuList(TYPE_PRET);
	});

	eventClicUpdate(TYPE_AMIS, ".btnUpdateAmis", ".blockAmis", "data-idAmis", function (tab, noeudParent) {
		tab.push(noeudParent.find(".spanValueAmis_nom"));
		tab.push(noeudParent.find(".spanValueAmis_prenom"));
		tab.push(noeudParent.find(".spanValueAmis_surnom"));
	});

	// Bouton de sauvegarde
	eventClickBtnSave(TYPE_AMIS, ".lienValide", ".blockAmis", "data-idAmis", function (tab, noeudParent) {
		tab.nom = noeudParent.find(".spanValueAmis_nom > input").val();
		tab.prenom = noeudParent.find(".spanValueAmis_prenom > input").val();
		tab.surnom = noeudParent.find(".spanValueAmis_surnom > input").val();
	});
}

function eventListType() {
	addEventImgDragDrop(".ctnModifImg");

	clickDelElem(".btnDelType", TYPE_TYPE, "data-idType", function () {
		// On actualise a nouveau la liste d'amis
		actuList(TYPE_TYPE);
		actuList(TYPE_PRET);
	});

	eventClicUpdate(TYPE_TYPE, ".btnUpdateType", ".lineType", "data-idtype", function (tab, noeudParent) {
		tab.push(noeudParent.find(".titreType"));
	});

	// Bouton de sauvegarde
	eventClickBtnSave(TYPE_TYPE, ".lienValide", ".lineType", "data-idtype", function (tab, noeudParent) {
		tab.nom = noeudParent.find(".titreType > input").val();
		var pathImgDroped = noeudParent.find(".ctnAffiNameImg").attr("data-pathimg");
		console.warn(pathImgDroped);
		//console.log(pathImgDroped);

		if (pathImgDroped)
			tab.img = pathImgDroped;
	});
}

function eventListPret() {

	clickDelElem(".btnDelPret", TYPE_PRET, "data-idpret", function () {
		// On actualise a nouveau la liste d'amis
		actuList(TYPE_PRET);
	});
}

function clickDelElem(classBtn, typeData, attrIdElem, callbackActu) {
	$(classBtn).on("click", function (event) {
		var resultBtn = dialog.showMessageBox({
			type: "info",
			title: "Confirmation",
			message: "Confirmation de suppression",
			detail: "Êtes-vous sure de vouloir supprimer cet élément ?",
			buttons: ["Non", "Oui"]
		});

		// Si le bouton "oui" est cliquer
		if (resultBtn === 1) {
			var idElem = $(this).parent().attr(attrIdElem);

			if (!isNaN(parseInt(idElem))) {

				file.delObj(typeData, 'id', idElem);

				// On actualise a nouveau les éléments après suppression
				callbackActu();
			} else
				console.warn("Erreur: L'id de l'élément du menu n'est pas valide.");
		}
		event.preventDefault();
	});
}

$("#dateRecu").pickadate({
	//formatSubmit: 'yyyy/mm/dd',
	//container: '#container'
	"selectMonths": true,
	"selectYears": true,
	"format": 'dd.mm.yyyy'
});


/**
  -- Gestion du drag and drop pour l'image.
*/
addEventImgDragDrop("#nomAddTypeImg");

function addEventImgDragDrop(classCtnImg) {

	var img = document.querySelectorAll(classCtnImg);
	//console.log(img);

	for (var i = 0; i < img.length; i++) {
		var currImg = img[i];

		currImg.ondragover = function () {
			//console.info("--------- drag");
			return false;
		};
		currImg.ondragleave = currImg.ondragend = function () {
			//console.info("--------- leave");
			return false;
		};

		currImg.ondrop = function (e) {
			//console.info("--------- drop");
			e.preventDefault();
			var file = e.dataTransfer.files[0];
			pathImg = file.path;
			console.log('File you dragged here is', file.path);
			var tabPath = path.parse(file.path);
			$(classCtnImg).find(".ctnAffiNameImg").html(tabPath.name + " " + tabPath.ext).attr("data-pathimg", file.path);
			return false;
		};
	}
}

function hideFn() {
	// Remise a 0 des variables utlisé par la fenetre
	isModUpdateOpen = false,
	currentElemOpen = null;

	// Cachement de la fenetres ouvertes
	$(".ctnPage").each(function (index, element) {
		if ($(element).css("display") == "block")
			$(element).hide(0);
	});
}

/**
  Information:
    Gestion de la partie "proposition instantanée" du moteur de recherche.
*/

var ctnDataSearch = $("#ctnDataSearch"),
	motorSearch = $("#motorSearch");

// var obj = file.getJson(pathFileOffline);

motorSearch.on("keyup click", function (event) {
	ctnDataSearch.html("");

	fs.readFile(pathFileOffline, (err, data) => {
		obj = JSON.parse(String(data));
		if (err) throw err;

		var valSearch = $(this).val();

		if (!valSearch) {
			ctnDataSearch.html("");
			return false;
		}

		var typeVerif = [
			"type",
			"amis",
			"pret"
		];

		var strInfo = {
			"type": "Recherche de la catégorie \"TYPE\"",
			"amis": "Recherche de la catégorie \"AMIS\"",
			"pret": "Recherche de la catégorie \"PRET\""
		};

		var propertyEvite = [
			"id",
			"idAmis",
			"idType",
			"idPret"
		];

		var lastType = null;
		// permet de parcourir chaque type d'information.
		for (var i = 0; i < typeVerif.length; i++) {
			var currentType = typeVerif[i];

			var objType = obj[currentType],
				tabTypeObj = objType.value;

			// Parcour chaque object d'un tableau (exp object [0] du tableau d'amis)
			for (var v = 0; v < tabTypeObj.length; v++) {
				var currentObj = tabTypeObj[v];

				// parcour des proprieter de l'object en cour (exp: nom, prenom, surnom d'un object du tableau d'amis)
				for (var proprieter in currentObj) {
					if (currentObj.hasOwnProperty(proprieter)) {
						if (propertyEvite.indexOf(proprieter) === -1) {
							var valuePro = String(currentObj[proprieter]);
							//console.log(typeof valuePro + " - " + proprieter);

							if (valuePro.indexOf(valSearch) >= 0) {
								if (lastType != currentType) {
									lastType = currentType;

									ctnDataSearch.append(`<div class="lineInfoSearch">` +
										currentType +
										`</div>`);
								}


								ctnDataSearch.append(`<div onclick="eventClickSearch(this);" data-type="` + currentType + `" data-idObj="` + currentObj.id + `">` +
									currentObj[proprieter] +
									`</div>`);


							}
						}
					}
				}
				ctnDataSearch.fadeIn(100);
			}
		}
	});
});

function eventClickSearch(btn) {
	var currbtn = $(btn),
		currId = currbtn.attr("data-idobj"),
		currtype = currbtn.attr("data-type");
	$ctnSearch = $(".ctnSearch");

	// Ajout de l'élément selectionner
	// Ajout des evenements sur l'element ajouté.
	actuList(currtype, "id", currId, true);

	hideFn();
	$ctnSearch.fadeIn(vitesse);

	ctnDataSearch.fadeOut(100);
}

$("body").click((event) => {
	if (!$(event.target).parent().is("#ctnDataSearch") && !$(event.target).is(motorSearch)) {
		ctnDataSearch.html("");
	}
});

/**
  -- Empecher de charger les fichier glisser n'importe ou dans la fenetre.
*/
document.addEventListener('dragover', function (event) {
	event.preventDefault();
	return false;
}, false);

document.addEventListener('drop', function (event) {
	event.preventDefault();
	return false;
}, false);


var $ctnLanguage = $(".ctnLanguage"),
	i18nLngs = i18next.options.languages,
	// Using for event vue
	currentLngSelected = null;

if (i18next.options.languages) {
	let strOutLanguage = '';
	let currentLng = currentLngSelected = app.getLng();

	for (var codeLng in i18nLngs) {
		if (i18nLngs.hasOwnProperty(codeLng)) {
			let objLng = i18nLngs[codeLng];

			strOutLanguage += `<li>
                            <a data-codeLng="` + codeLng + `" href="#" ` + (currentLng==codeLng? `class="lienActive"` : '') + `>
                              <img src="img/pays/` + objLng.flag + `" alt="">
                              <span data-i18n="` + objLng.fullNameEn + `">` + objLng.fullNameEn + `</span>
                            </a>
                          </li>`;
		}
	}

	$(".ctnListLanguage > ul").html(strOutLanguage);
}

$(".ctnListLanguage > ul").on("click", "li > a", function(){
	let lngSelected = $(this).attr("data-codeLng");

	console.info(app);
	// if the code selected exist in the list of each languages accepted
	if(Object.keys(i18next.options.languages).indexOf(lngSelected) > -1 && lngSelected != i18next.language){
		//Part vue vue
		if(currentLngSelected != lngSelected){
			$(".ctnListLanguage > ul a.lienActive").removeAttr("class");
			$(this).attr("class", "lienActive");
			currentLngSelected = lngSelected;
		}

		// Part for change language
		if(typeof app.setSetting("setting", {
			"defaultLng": lngSelected
		}) == "object")
			console.info("New language saved.");
		else
			console.warn("No change about Language.");
	}
});


//hideFn();
//$ctnLanguage.fadeIn(vitesse);


