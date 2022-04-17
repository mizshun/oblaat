var oblaat = oblaat || {};

(function (w, obl) {
  'use strict';

  var address = 'mizzz.work';

  var win  = w,
      doc  = win.document,
      body = doc.body,
      head = doc.getElementsByTagName('head')[0];

  obl = {
    loader: function () {
      var ss_1  = doc.createElement('link');
      ss_1.href = 'https://fonts.googleapis.com/css?family=Cinzel&subset=latin';
      ss_1.rel  = 'stylesheet';
      ss_1.type = 'text/css';
      head.appendChild(ss_1);

      var ss2  = doc.createElement('link');
      // ss2.href = 'https://study/products/oblaat/oblaat.css';
      ss2.href = 'https://' + address + '/oblaat/oblaat.css';
      ss2.rel  = 'stylesheet';
      ss2.type = 'text/css';
      head.appendChild(ss2);

      if (!window.jQuery) {
        var jq = doc.createElement('script');
        jq.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
        doc.body.appendChild(jq);

        jq.addEventListener('load', function () {
          obl.init(win.jQuery);
        }, false);
      } else {
        obl.init(win.jQuery);
      }
    },

    init: function (jq) {
      var $           = jq,
          NAMESPACE   = 'oblaat',
          docH        = $(doc).height(),
          shiftActive = false;

    /*----------------------------------------
      DOM
    ----------------------------------------*/
      var $modalBgElm         = $('<div id = oblaat-modalBg />'),
          // ドロップエリア
          $modalElm           = $('<div id = oblaat-modal />'),
          $modalDropElm       = $('<div id = oblaat-modal-drop />').text('Drop the image'),
          $modalSelectElm     = $('<div id = oblaat-modal-select />'),
          $modalSelectFileElm = $('<input type="file" accept="image/*" name="files[]" id = files />'),
          // メインコントローラー
          $mainCtlElm         = $('<div id = oblaat-mainCtl />'),
          // サブパネル表示ボタン
          $mainCtlHeadElm     = $('<div id = oblaat-mainCtl-head title="Click to open the information panel" />').html(
            ['<ul>',
              '<li>x: <span class="oblaat-image-x"></span></li>',
              '<li>y: <span class="oblaat-image-y"></span></li>',
            '</ul>'].join('')
          ),
          // 透明度スライダー
          $mainCtlOpaElm      = $('<div id = oblaat-mainCtl-opacity />'),
          $mainCtlOpaKnobElm  = $('<div id = oblaat-mainCtl-opacity-knob title="Change the opacity by dragging" />'),
          $mainCtlDispElm     = $('<div id = oblaat-mainCtl-display />').html(
            ['<ul>',
              '<li>Display</li>',
              '<li><span>On</span></li>',
            '</ul>'].join('')
          ),
          // 十字キー
          $mainCtlCursorElm   = $('<div id = oblaat-mainCtl-cursor />'),
          $mainCtlCrsTpElm    = $('<div id = oblaat-mainCtl-cursor-top />'),
          $mainCtlCrsBtElm    = $('<div id = oblaat-mainCtl-cursor-bottom />'),
          $mainCtlCrsLfElm    = $('<div id = oblaat-mainCtl-cursor-left />'),
          $mainCtlCrsRtElm    = $('<div id = oblaat-mainCtl-cursor-right />'),
          $mainCtlMoveStopElm = $('<div id = oblaat-mainCtl-moveStop title="Fixing the image" />'),
          // サブパネル
          $mainCtlInfoElm     = $('<div id = oblaat-mainCtl-info />'),
          $mainCtlInfoSaveElm = $('<div id = oblaat-mainCtl-info-save title="Save the position(and opacity) of the image to local storage" />').html('<span>SAVE</span>'),
          $mainCtlInfoDelElm  = $('<div id = oblaat-mainCtl-info-delete title="Delete the position(and opacity) of the image saved in the local storage" />').html('<span>DELETE</span>'),
          $mainCtlInfoLoadElm = $('<div id = oblaat-mainCtl-info-load title="Load the position(and opacity) of the image saved in the local storage" />').html('<span>LOAD</span>'),
          $mainCtlInfoMainElm = $('<div id = oblaat-mainCtl-info-main />').html(
            ['<ul>',
              '<li><p class="header">Image Info</p></li>',
              '<li><span class="oblaat-image-name"></span></li>',
              '<li>w: <span class="oblaat-image-w"></span></li>',
              '<li>h: <span class="oblaat-image-h"></span></li>',
              '<li>x: <span class="oblaat-image-x"></span></li>',
              '<li>y: <span class="oblaat-image-y"></span></li>',
              '<li>opacity: <span class="oblaat-image-opa"></span></li>',
            '</ul>'].join('')
          ),
          $mainCtlInfoScElm   = $('<div id = oblaat-mainCtl-info-sc />').html(
            ['<ul>',
              '<li><p class="header">SHORT CUT</p></li>',
              '<li><p>Fixing the image On/Off</p><p class="fwB">[Shift] + [Q]</p></li>',
              '<li><p>Image Display On/Off</p><p class="fwB">[Ctrl] + [Q]</p></li>',
              '<li><p>Controller Display On/Off</p><p class="fwB">[Ctrl] + [Shift] + [Q]</p></li>',
            '</ul>'].join('')
          ),
          // 画像エリア
          $designElm          = $('<div id = oblaat-design />'),
          $designImgElm       = $('<img id = oblaat-design-image draggable="false" />'); // ブラウザの画像へのドラッグ処理をfalseに

      // DOM追加
      $modalSelectElm
        .append($modalSelectFileElm);
      $modalElm
        .append($modalDropElm)
        .append($modalSelectElm)
        .hide();

      $mainCtlOpaElm
        .append($mainCtlOpaKnobElm);
      $mainCtlCursorElm
        .append($mainCtlCrsTpElm)
        .append($mainCtlCrsBtElm)
        .append($mainCtlCrsLfElm)
        .append($mainCtlCrsRtElm)
        .append($mainCtlMoveStopElm);
      $mainCtlInfoElm
        .append($mainCtlInfoSaveElm)
        .append($mainCtlInfoDelElm)
        .append($mainCtlInfoLoadElm)
        .append($mainCtlInfoMainElm)
        .append($mainCtlInfoScElm)
        .css({
          opacity: 0,
          right  : 0,
          display: 'none'
        })
        .hide();
      $mainCtlElm
        .append($mainCtlInfoElm)
        .append($mainCtlHeadElm)
        .append($mainCtlOpaElm)
        .append($mainCtlDispElm)
        .append($mainCtlCursorElm);
        // .hide();

      $designElm
        .append($designImgElm)
        .hide();

      $(body)
        .append($modalBgElm)
        .append($modalElm)
        .append($mainCtlElm)
        .append($designElm);

        $mainCtlElm.hide();

      // 画像情報表示
      var $oblaatImageNameElms = $('.oblaat-image-name'),
          $oblaatWElms         = $('.oblaat-image-w'),
          $oblaatHElms         = $('.oblaat-image-h'),
          $oblaatXElms         = $('.oblaat-image-x'),
          $oblaatYElms         = $('.oblaat-image-y'),
          $oblaatOpaElms       = $('.oblaat-image-opa');

    /*----------------------------------------
      DROPZONE MODALPANEL
    ----------------------------------------*/
      var modal = {
        openSpeed: 300,

        dragOver: function (e) {
          e.stopPropagation();
          e.preventDefault();
        },

        openFileFromDropSelect: function (e) {
          e.stopPropagation();
          e.preventDefault();

          var files = e.dataTransfer ? e.dataTransfer.files : e.target.files; // FileList object
          for (var i = 0, f; f = files[i]; i++) {
            // design.curFile.name = win.escape(f.name);
            design.curFile.name = f.name;
            modal.readFile(f);
          }
          modal.closeModal();
        },

        readFile: function (f) {
          if (!f.type.match('image.*')) {
            alert('Please select an image file!');
            return;
          }

          var reader = new FileReader();
          reader.onload = function(e) {
            $designImgElm[0].src   = e.target.result;
            $designImgElm[0].title = design.curFile.name;

            // 画像読み込み完了時
            $designImgElm.bind('load', function () {
              design.curFile.w = $(this)[0].width;
              design.curFile.h = $(this)[0].height;
              mainCtl.init();
              design.init();
            });
          };
          reader.readAsDataURL(f);
        },

        openModal: function () {
          $modalElm.add($modalBgElm).fadeIn(modal.openSpeed);
        },

        closeModal: function () {
          $modalElm.add($modalBgElm).fadeOut(modal.openSpeed);
        },

        init: function () {
          util.support = util.checkFileAPISupported();
          modal.openModal();
          $modalDropElm[0].addEventListener('dragover', modal.dragOver, false);
          $modalDropElm[0].addEventListener('drop', modal.openFileFromDropSelect, false);
          $modalSelectFileElm[0].addEventListener('change', modal.openFileFromDropSelect, false);
        }
      }; // DROPZONE MODALPANEL


    /*----------------------------------------
      MAIN CONTROLLER
    ----------------------------------------*/
      var mainCtl = {
        openSpeed: 300,
        openFlg  : true,
        infoFlg  : false,
        sliderRange: 0, // スライダー上限値
        curPos   : { top : 0 },
        mousePos : { top : 0, prevPos: { y: 0 } },

        /* コントローラー表示 */
        toggle: function () {
          if (mainCtl.openFlg) {
            mainCtl.openMainCtl();
          } else {
            mainCtl.closeMainCtl();
          }
        },

        openMainCtl: function () {
          $mainCtlElm.queue([]).stop().fadeIn(mainCtl.openSpeed);
          mainCtl.openFlg = false;
        },

        closeMainCtl: function () {
          $mainCtlElm.queue([]).stop().fadeOut(mainCtl.openSpeed);
          mainCtl.openFlg = true;
        },

        /* サブパネル表示 */
        toggleInfo: function (e) {
          if (!mainCtl.infoFlg) {
            mainCtl.openInfo();
          } else {
            mainCtl.closeInfo();
          }
        },

        openInfo: function () {
          $mainCtlInfoElm.queue([]).stop()
            .css('display', 'block')
            .animate({
              opacity: 1,
              right: 96
            }, mainCtl.openSpeed);
          mainCtl.infoFlg = true;
        },

        closeInfo: function () {
          $mainCtlInfoElm.queue([]).stop()
            .animate({
              opacity: 0,
              right: 0
            }, mainCtl.openSpeed,
            function () {
              $(this).css('display', 'none');
            });
          mainCtl.infoFlg = false;
        },

        updateImageInfo: function () {
          $oblaatImageNameElms.text(design.curFile.name);
          $oblaatWElms.text(design.curFile.w);
          $oblaatHElms.text(design.curFile.h);
          $oblaatXElms.text(design.curPos.left);
          $oblaatYElms.text(design.curPos.top);
        },

        /* 透明度スライダーノブを操作 */
        moveByDrag: function (e) {
          mainCtl.curPos.top = $(e.target).position().top;
          mainCtl.mousePos.prevPos.y = e.pageY;
          $(e.target).bind('mousemove', mainCtl.movingByDrag);
          $(e.target).bind('mouseup', mainCtl.moveEndDrag);
          return false;
        },

        movingByDrag: function (e) {
          var pos     = $(e.target).position().top,
              opacity = design.opacity;

          // 範囲内
          if (pos >= 0 && pos <= mainCtl.sliderRange) {
            mainCtl.mousePos.top = mainCtl.mousePos.prevPos.y - e.pageY;
            mainCtl.curPos.top   = mainCtl.curPos.top - mainCtl.mousePos.top;
            $(e.target).css({ top: mainCtl.curPos.top });
            mainCtl.mousePos.prevPos.y = e.pageY;
            opacity = mainCtl.transOapcityFromPos(mainCtl.curPos.top, mainCtl.sliderRange);
            design.changeOpacity(opacity);
            return false;

          // 範囲外
          } else {
            pos = Math.max(0, Math.min(mainCtl.sliderRange, $(e.target).position().top));
            $(e.target).css({ top: pos });
            return false;
          }
        },

        moveEndDrag: function (e) {
          $(e.target).unbind('mousemove');
          $(e.target).unbind('mouseup');
        },

        /* 透明度算出 [0~1] */
        transOapcityFromPos: function (current, range) {
          var f = Math.max(0, Math.min(1, (current / range).toFixed(2)));
          return 1 - f;
        },

        toggleDispDesign: function () {
          design.toggle();
        },

        /* 画像移動可否 */
        toggleMoveDesign: function () {
          design.moveflg = design.moveflg ? false : true;
          return design.moveflg;
        },

        /* 十字カーソルで画像を移動 */
        moveDesignByCursor: function (e) {
          var dir = e.target.id.replace(/.*cursor-(.*)/, '$1');
          util.movePos[dir]($designElm, shiftActive);
        },

        /* セーブ */
        saveImageData: function () {
          var imageData = {
            curPos: {
              left: design.curPos.left,
              top : design.curPos.top
            }
          };
          localStorage[NAMESPACE] = JSON.stringify(imageData);
          $mainCtlInfoSaveElm.find('span').animate({
            marginTop: 8
          }, {
            complete: function () {
              $(this).animate({ marginTop: 0 }, 100);
            }
          }, 100);
        },

        /* セーブデータ消去 */
        deleteImageData: function () {
          if(!localStorage[NAMESPACE]) {
            alert('NO DATA');
            return;
          }
          delete localStorage[NAMESPACE];
          $mainCtlInfoDelElm.find('span').animate({
            marginTop: 8
          }, {
            complete: function () {
              $(this).animate({ marginTop: 0 }, 100);
            }
          }, 100);
        },

        /* セーブデータ読み込み */
        loadImageData: function () {
          if(!localStorage[NAMESPACE]) {
            alert('NO DATA');
            return;
          }
          var imageData = JSON.parse(localStorage[NAMESPACE]);
          design.curPos.left  = imageData.curPos.left;
          design.curPos.top   = imageData.curPos.top;
          design.opacity      = imageData.opacity;
          design.setPosOpaImage();
          $mainCtlInfoLoadElm.find('span').animate({
            marginTop: 8
          }, {
            complete: function () {
              $(this).animate({ marginTop: 0 }, 100);
            }
          }, 100);
        },

        init: function () {
          mainCtl.toggle();
          $mainCtlHeadElm.bind('click', mainCtl.toggleInfo);
          $mainCtlCursorElm.children().not($mainCtlMoveStopElm).bind('click', mainCtl.moveDesignByCursor);
          $mainCtlOpaKnobElm.bind('mousedown', mainCtl.moveByDrag);
          $mainCtlDispElm.bind('click', mainCtl.toggleDispDesign);
          $mainCtlMoveStopElm.bind('click', mainCtl.toggleMoveDesign);
          $mainCtlInfoSaveElm.bind('click', mainCtl.saveImageData);
          $mainCtlInfoDelElm.bind('click', mainCtl.deleteImageData);
          $mainCtlInfoLoadElm.bind('click', mainCtl.loadImageData);
          mainCtl.updateImageInfo();
          mainCtl.sliderRange = $mainCtlOpaElm.height() - $mainCtlOpaKnobElm.height();
          design.changeOpacity(design.opacity);
        }
      }; // MAIN CONTROLLER


    /*----------------------------------------
      DESIGN IMAGE
    ----------------------------------------*/
      var design = {
        openSpeed: 300,
        openFlg  : true,
        moveflg  : true,
        opacity  : 1,
        curFile: {
          name: '',
          w   : 0,
          h   : 0
        },
        curPos   : { top : 0, left: 0 },
        mousePos : { top : 0, left: 0, prevPos: { x: 0, y: 0 } },

        /*　十字カーソルで移動　*/
        moveByKeycode: function (e) {
          if (!design.moveflg) { return; }
          $designElm.queue([]).stop();

          var key = util.getKeycode(e);
          util.movePos($designElm, shiftActive);
        },

        /* ドラッグで移動 */
        moveByDrag: function (e) {
          if (!design.moveflg) { return; }
          $designElm.queue([]).stop();

          design.mousePos.prevPos.x = e.pageX;
          design.mousePos.prevPos.y = e.pageY;
          $(e.currentTarget).bind('mousemove', design.movingByDrag);
          $(e.currentTarget).bind('mouseup', design.moveEndDrag);
          return false;
        },

        movingByDrag: function (e) {
          design.mousePos.left = design.mousePos.prevPos.x - e.pageX;
          design.mousePos.top  = design.mousePos.prevPos.y - e.pageY;
          design.curPos.left   = design.curPos.left - design.mousePos.left;
          design.curPos.top    = design.curPos.top - design.mousePos.top;
          $(e.currentTarget).css({
            left: design.curPos.left,
            top : design.curPos.top
          });
          design.mousePos.prevPos.x = e.pageX;
          design.mousePos.prevPos.y = e.pageY;
          mainCtl.updateImageInfo();
          return false;
        },

        moveEndDrag: function (e) {
          $(e.currentTarget).unbind('mousemove');
          $(e.currentTarget).unbind('mouseup');
        },

        changeOpacity: function (opacity) {
          design.opacity = opacity.toFixed(2);
          $designElm.css('opacity', design.opacity);
          $oblaatOpaElms.text(design.opacity);

        },

        setPosOpaImage: function () {
          $designElm.queue([]).stop().animate({
            left: design.curPos.left,
            top : design.curPos.top
          },{
            easing  : 'swing',
            duration: 1500,
            complete: function () {
              mainCtl.updateImageInfo();
            }
          });
        },

        /* デザイン画像表示 */
        toggle: function () {
          if (design.openFlg) {
            design.open();
          } else {
            design.close();
          }
        },

        open: function () {
          $designElm.fadeIn(design.openSpeed);
          $mainCtlDispElm.find('span').text('On');
          design.openFlg = false;
        },

        close: function () {
          $designElm.fadeOut(design.openSpeed);
          $mainCtlDispElm.find('span').text('Off');
          design.openFlg = true;
        },

        init: function () {
          $designImgElm.width(design.curFile.w);
          $designImgElm.height(design.curFile.h);
          design.toggle();
          $designElm.bind('mousedown', design.moveByDrag);
        }
      }; // DESIGN IMAGE


    /*----------------------------------------
      KEY BINDING ACTION
    ----------------------------------------*/
      var keyBind = function (e) {
        var key = util.getKeycode(e);

        if (e.type === 'keydown') {
          if (key.shift && key.ctl && key.code === 81) { // [shift] + [ctrl] + [Q]
            mainCtl.toggle();
            return;
          }

          if ((key.ctl && key.code === 81)) { // [ctrl] + [Q] || key.code === 229
            design.toggle();
            return;
          }

          if (key.shift && key.code === 81) { // [shift] + [Q]
            mainCtl.toggleMoveDesign();
            return;
          }

          if (key.code === 38) { // [↑]
            util.movePos.top($designElm, shiftActive);
            return false;
          }

          if (key.code === 40) { // [↓]
            util.movePos.bottom($designElm, shiftActive);
            return false;
          }

          if (key.code === 39) { // [→]
            util.movePos.right($designElm, shiftActive);
            return false;
          }

          if (key.code === 37) { // [←]
            util.movePos.left($designElm, shiftActive);
            return false;
          }

          if (key.code === 16) { // [shift]
            shiftActive = true;
          }
        }

        if (e.type === 'keyup') {
          if (key.code === 16) { // [shift]
            shiftActive = false;
          }
        }
      }; // KEY BINDING ACTION


    /*----------------------------------------
      UTILITY
    ----------------------------------------*/
      var util = {
        support: false,

        checkFileAPISupported: function () {
          return Boolean(win.File && win.FileReader && win.FileList);
        },

        /* キーコード取得 */
        getKeycode: function (e) {
          return {
            code  : e.which,
            shift : e.shiftKey,
            alt   : e.altKey,
            ctl   : e.ctrlKey
          };
        },

        /* 移動 */
        movePos: {
          top: function (target, shiftActive) {
            if (!design.moveflg) { return; }
            $designElm.queue([]).stop();
            var shift = shiftActive ? 10 : 1;
            design.curPos.top = parseInt(target.css('top'), 10) - 1 * shift;
            target.css({
              top: design.curPos.top
            });
            mainCtl.updateImageInfo();
          },
          bottom: function (target, shiftActive) {
            if (!design.moveflg) { return; }
            $designElm.queue([]).stop();
            var shift = shiftActive ? 10 : 1;
            design.curPos.top = parseInt(target.css('top'), 10) + 1  * shift;
            target.css({
              top: design.curPos.top
            });
            mainCtl.updateImageInfo();
          },
          right: function (target, shiftActive) {
            if (!design.moveflg) { return; }
            $designElm.queue([]).stop();
            var shift = shiftActive ? 10 : 1;
            design.curPos.left = parseInt(target.css('left'), 10) + 1  * shift;
            target.css({
              left: design.curPos.left
            });
            mainCtl.updateImageInfo();
          },
          left: function (target, shiftActive) {
            if (!design.moveflg) { return; }
            $designElm.queue([]).stop();
            var shift = shiftActive ? 10 : 1;
            design.curPos.left = parseInt(target.css('left'), 10)  - 1 * shift;
            target.css({
              left: design.curPos.left
            });
            mainCtl.updateImageInfo();
          }
        }
      }; // util


    /*----------------------------------------
      INITIARIZE
    ----------------------------------------*/
      (function () {
         modal.init();
         $(win).bind('keydown keyup', keyBind);
       })();
    }
  };
  obl.loader();
})(window, oblaat);
