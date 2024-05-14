var imageIndex = 0

var l = document.location + ''
l = l.replace(/%20/g, ' ')
/*
    var index = l.indexOf('?t=');
    if (index == -1) document.location=l + "?t=Hello";
    */
var index = ''

var mouseX = -1
var mouseY = -1
var canvasW = 0
var canvasH = 0

var pixels = new Array()
var txt = new Array()

var canv = $0('canv')
var ctx = canv.getContext('2d')
var canvSource = $0('canvSource')
var canvSourceCtx = canvSource.getContext('2d')

var resHalfFloor = 0
var resHalfCeil = 0
var resolution = 1

var params = new Array()
params['thresholdContrastMin'] = 0 // slider (between 255 and 0)
params['thresholdContrastMax'] = 255 // slider (between 255 and 0)
params['cursorForceRadius'] = 10000 // slider
params['whiteNoise'] = 70
params['particlesColor'] = '#FF561E'
params['backgroundColor'] = '#F7B753'

var particlesColor = {
  r: hexToRgb(params['particlesColor']).r,
  g: hexToRgb(params['particlesColor']).g,
  b: hexToRgb(params['particlesColor']).b,
}

var backgroundColor = {
  r: hexToRgb(params['backgroundColor']).r,
  g: hexToRgb(params['backgroundColor']).g,
  b: hexToRgb(params['backgroundColor']).b,
}

var words = ''
var n = 0
var timerRunning = false

var indexFromWherePixelsAreDying = 0
var timeoutParamChange = null

$(function () {
  generateFrameItem('dot.jpg')
  generateFrameItem('chevrons.jpg')
  generateFrameItem('fleches2.jpg')
  generateFrameItem('jeu.jpg')
  generateFrameItem('light.jpg')

  $('.param-color-selector[data-param="backgroundColor"]').val(
    params['backgroundColor']
  )
  $('.param-color-selector[data-param="particlesColor"]').val(
    params['particlesColor']
  )

  $('.captureModeButton').on('click', function () {
    $('body').toggleClass('capture-mode')
  })

  $(document).keyup(function (e) {
    if (e.key === 'Escape') {
      $('body').removeClass('capture-mode')
    }

    if (e.key === 'ArrowDown') {
      switchToNextFrame()
    }

    if (e.key === 'ArrowUp') {
      switchToPreviousFrame()
    }
  })

  $('.param--on-input').on('input', function () {
    var param = $(this).data('param')
    var val = $(this).val()

    params[param] = val

    init()
  })

  $('.param--on-change').on('change', function () {
    var _this = $(this)

    clearTimeout(timeoutParamChange)

    timeoutParamChange = setTimeout(function () {
      var param = _this.data('param')
      var val = _this.val()

      params[param] = val
      console.log(val)

      init()
    }, 1)
  })

  $('.param--on-click').on('click', function () {
    var _this = $(this)

    var param = $(this).data('param')
    var val = $(this).data('value')

    params[param] = val

    $('.param-color-selector[data-param="' + param + '"]').val(val)

    init()
  })

  $('.createNewFrame').on('click', function () {
    $('.frameUpload').trigger('click')
  })

  $('#wordsTxt').on('keyup blur click', function () {
    init()
  })

  $('.frameUpload').on('change', function (e) {
    console.log('upload')

    var input = this
    var _this = $(this)

    if (input.files && input.files[0]) {
      var reader = new FileReader()

      reader.onload = function (e) {
        generateFrameItem(e.target.result)
      }

      reader.readAsDataURL(input.files[0])
    }
  })

  $('.framesContainer').sortable({
    axis: 'y',
    containment: 'parent',
    tolerance: 'pointer',
    handle: '.frameItemDrag',
    start: function (event, ui) {
      $('.framesContainer .frameItem').removeClass('current')
    },
    // change: function(event, ui) {
    //   setCurrentFrameInFramesManager();
    // },
    stop: function (event, ui) {
      init()
    },
  })

  $('body').on('click', '.frameItemRemove', function () {
    $(this).closest($('.frameItem')).remove()
    init()
  })

  $('body').on('click', '.savedFrameRemove', function () {
    $(this).closest($('.savedFrame')).remove()
    init()
  })

  $('body').on('click', '.savedFrameDownloadSVG', function () {
    downloadSVG($(this).closest('.savedFrame'), $(this).data('svg'))
  })
})

function generateFrameItem(imgSrc) {
  var frameItem = $('.clones .frameItem').clone()

  frameItem.find('img').attr('src', imgSrc)

  frameItem.on('click', function () {
    var _this = $(this)
    setTimeout(function () {
      setCurrentFrame(_this)
    }, 20)
  })

  frameItem.appendTo($('.framesContainer'))

  // var frameItem = $('<div></div>').addClass('frameItem');
  // $('<img crossorigin="Anonymous">').addClass('frameForCanvas').attr('src', imgSrc).appendTo(frameItem);
  // $('<img crossorigin="Anonymous">').addClass('frameForManager').attr('src', imgSrc).appendTo(frameItem);
  // frameItem.appendTo($('.framesContainer'));
}

function saveF() {
  var pixelsOfThisFrame = []

  for (var i = pixels.length - 1; i >= 0; i--) {
    pixelsOfThisFrame.push({
      x: pixels[i].x,
      y: pixels[i].y,
      a: pixels[i].alpha,
    })
  }

  console.log(JSON.stringify(pixelsOfThisFrame))

  var img = canv.toDataURL('image/png')

  var savedFrame = $('.clones .savedFrame').clone()

  savedFrame
    .find('.savedFrameThumbnail')
    .css('background-image', 'url(' + img + ')')
  savedFrame
    .find('.savedFramePreviewImg')
    .css('background-image', 'url(' + img + ')')
  savedFrame.find('.savedFrameDownload').attr('href', img)
  savedFrame
    .find('.savedFrameDownloadSVG')
    .data('svg', JSON.stringify(pixelsOfThisFrame))

  savedFrame.appendTo($('.savedFramesContainer'))
}

function downloadSVG(savedFrame, jsonPixels) {
  savedFrame.addClass('download-svg-progress')

  var pixelsOfThisFrame = JSON.parse(jsonPixels)

  var SVGctx = new C2S(document.body.clientWidth, document.body.clientHeight)

  SVGctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight)

  SVGctx.fillStyle = params['backgroundColor']
  SVGctx.fillRect(0, 0, document.body.clientWidth, document.body.clientHeight)

  SVGctx.fillStyle = params['particlesColor']

  for (var i = pixelsOfThisFrame.length - 1; i >= 0; i--) {
    goodX = Math.floor(pixelsOfThisFrame[i].x)
    goodY = Math.floor(pixelsOfThisFrame[i].y)

    SVGctx.fillRect(goodX, goodY, 2, 2)
  }

  var svg_source = SVGctx.getSerializedSvg()
  var svgBlob = new Blob([svg_source], { type: 'image/svg+xml;charset=utf-8' })
  var svgUrl = URL.createObjectURL(svgBlob)

  savedFrame.find('.savedFrameDownloadSVGLink').attr('href', svgUrl)

  setTimeout(function () {
    savedFrame
      .removeClass('download-svg-progress')
      .addClass('download-svg-ready')
  }, 500)
}

function canv_mousemove(event) {
  mouseX = event.clientX - canv.offsetLeft
  mouseY = event.clientY - canv.offsetTop
}

function Pixel(homeX, homeY, lum) {
  this.homeX = homeX
  this.homeY = homeY
  this.lum = lum
  this.alpha = 255
  this.isDying = false

  // If there are some existing pixels,
  // we use one of them as a "from" point
  if (pixels.length > 0) {
    var randomPixelIndex = Math.floor(Math.random() * pixels.length)
    this.x = pixels[randomPixelIndex].x
    this.y = pixels[randomPixelIndex].y
  }

  // If there is no existing pixel,
  // let's randomize the "from" point
  else {
    this.x = Math.random() * canvasW
    this.y = Math.random() * canvasH
  }

  this.xVelocity = 0
  this.yVelocity = 0
}

Pixel.prototype.die = function () {
  this.isDying = true

  // We use another pixel as the final motion's destination of the point
  var randomPixelIndex = Math.floor(
    Math.random() * indexFromWherePixelsAreDying
  )
  this.homeX = pixels[randomPixelIndex].homeX
  this.homeY = pixels[randomPixelIndex].homeY
}

Pixel.prototype.move = function () {
  var homeDX = this.homeX - this.x
  var homeDY = this.homeY - this.y
  var homeDistance = Math.sqrt(Math.pow(homeDX, 2) + Math.pow(homeDY, 2))
  var homeForce = homeDistance * 0.01
  var homeAngle = Math.atan2(homeDY, homeDX)

  var cursorForce = 0
  var cursorAngle = 0

  if (mouseX >= 0) {
    var cursorDX = this.x - mouseX
    var cursorDY = this.y - mouseY
    var cursorDistanceSquared = Math.pow(cursorDX, 2) + Math.pow(cursorDY, 2)
    cursorForce = Math.min(
      params['cursorForceRadius'] / cursorDistanceSquared,
      params['cursorForceRadius']
    )
    cursorAngle = Math.atan2(cursorDY, cursorDX)
  } else {
    cursorForce = 0
    cursorAngle = 0
  }

  this.xVelocity +=
    homeForce * Math.cos(homeAngle) + cursorForce * Math.cos(cursorAngle)
  this.yVelocity +=
    homeForce * Math.sin(homeAngle) + cursorForce * Math.sin(cursorAngle)

  this.xVelocity *= 0.82
  this.yVelocity *= 0.82

  this.x += this.xVelocity
  this.y += this.yVelocity
}

function $0(id) {
  return document.getElementById(id)
}

function timer() {
  if (!timerRunning) {
    timerRunning = true
    setTimeout(timer, 33)
    for (var i = 0; i < pixels.length; i++) {
      pixels[i].move()
    }

    drawPixels()
    //  wordsTxt.focus();

    n++
    if (
      n % 10 == 0 &&
      (canvasW != document.body.clientWidth ||
        canvasH != document.body.clientHeight)
    )
      body_resize()
    timerRunning = false
  } else {
    setTimeout(timer, 10)
  }
}

function drawPixels() {
  var imageData = ctx.createImageData(canvasW, canvasH)
  var actualData = imageData.data

  var index
  var goodX
  var goodY
  var realX
  var realY

  for (var i = pixels.length - 1; i >= 0; i--) {
    goodX = Math.floor(pixels[i].x)
    goodY = Math.floor(pixels[i].y)

    for (
      realX = goodX - resHalfFloor;
      realX <= goodX + resHalfCeil && realX >= 0 && realX < canvasW;
      realX++
    ) {
      for (
        realY = goodY - resHalfFloor;
        realY <= goodY + resHalfCeil && realY >= 0 && realY < canvasH;
        realY++
      ) {
        index = (realY * imageData.width + realX) * 4

        if (pixels[i].isDying == true) {
          var r = particlesColor.r
          var g = particlesColor.g
          var b = particlesColor.b
          pixels[i].alpha -= 5
        } else {
          var r = particlesColor.r
          var g = particlesColor.g
          var b = particlesColor.b
        }

        actualData[index] = r
        actualData[index + 1] = g
        actualData[index + 2] = b
        actualData[index + 3] = pixels[i].alpha
      }
    }

    if (pixels[i].alpha <= 0) {
      pixels.splice(i, 1)
    }
  }

  imageData.data = actualData
  ctx.putImageData(imageData, 0, 0)
}

function readWords() {
  words = $0('wordsTxt').value
  txt = words.split('\n')
}

function useWords() {
  var fontSize = 200
  var wordWidth = 0
  do {
    wordWidth = 0
    fontSize -= 5
    canvSourceCtx.fillStyle = 'red'
    canvSourceCtx.font = fontSize + 'px Gravur-CondensedLight'

    for (var i = 0; i < txt.length; i++) {
      var w = canvSourceCtx.measureText(txt[i]).width
      if (w > wordWidth) wordWidth = w
    }
  } while (wordWidth > canvasW - 100 || fontSize * txt.length > canvasH - 100)

  //    canvSourceCtx.clearRect(0,0,canvasW,canvasH);
  canvSourceCtx.textAlign = 'left'
  canvSourceCtx.textBaseline = 'middle'
  for (var i = 0; i < txt.length; i++) {
    canvSourceCtx.fillText(
      txt[i],
      canvasW / 2 - wordWidth / 2,
      canvasH / 2 - fontSize * (txt.length / 2 - (i + 0.5))
    )
  }
}

function setCurrentFrameInFramesManager() {
  $('.framesContainer .frameItem').removeClass('current')
  $('.framesContainer .frameItem').eq(imageIndex).addClass('current')
}

function setCurrentFrame(frameItem) {
  console.log(frameItem.index())

  imageIndex = frameItem.index()

  init()
}

function switchToPreviousFrame() {
  if (imageIndex <= 0) {
    imageIndex = $('.framesContainer .frameForCanvas').length - 1
  } else {
    imageIndex--
  }
  init()
}

function switchToNextFrame() {
  if (imageIndex < $('.framesContainer .frameForCanvas').length - 1) {
    imageIndex++
  } else {
    imageIndex = 0
  }
  init()
}

function init() {
  readWords()

  particlesColor = {
    r: hexToRgb(params['particlesColor']).r,
    g: hexToRgb(params['particlesColor']).g,
    b: hexToRgb(params['particlesColor']).b,
  }

  backgroundColor = {
    r: hexToRgb(params['backgroundColor']).r,
    g: hexToRgb(params['backgroundColor']).g,
    b: hexToRgb(params['backgroundColor']).b,
  }

  document.getElementsByTagName('body')[0].style.background =
    params['backgroundColor']

  canvSourceCtx.fillStyle = 'white'
  canvSourceCtx.fillRect(0, 0, canvasW, canvasH)

  // useWords();

  var index = 0
  imageIndex =
    imageIndex < $('.framesContainer .frameForCanvas').length ? imageIndex : 0

  setCurrentFrameInFramesManager()

  var img = $('.framesContainer .frameForCanvas').eq(imageIndex)[0]

  var imgRatio = img.width / img.height

  if (img.height > canvasH) {
    console.log(img.height + ' ' + canvasH)
    img.height = canvasH
    img.width = img.height * imgRatio
    console.log('imgW: ' + img.width + ' imgH: ' + img.height)
  }

  canvSourceCtx.drawImage(
    img,
    (canvasW - img.width) / 2,
    (canvasH - img.height) / 2,
    img.width,
    img.height
  )

  /*
      for(var x=0;x<canvasW;x+=resolution) {
        for(var y=0;y<canvasH;y+=resolution) {
          if (Math.random() * 100 < params['whiteNoise']) {
            canvSourceCtx.fillRect(x,y,1,1);
          }
        }
      }
      */

  var imageData = canvSourceCtx.getImageData(0, 0, canvasW, canvasH)

  for (
    var x = 0;
    x < imageData.width;
    x += resolution //var i=0;i<imageData.data.length;i+=4)
  ) {
    for (var y = 0; y < imageData.height; y += resolution) {
      i = (y * imageData.width + x) * 4

      var r = imageData.data[i]
      var g = imageData.data[i + 1]
      var b = imageData.data[i + 2]
      var lum = (r + r + b + g + g + g) / 6

      //  console.log(lum);

      //    if(imageData.data[i+3]>128)

      if (
        lum < params['thresholdContrastMax'] &&
        lum > params['thresholdContrastMin']
      ) {
        // => Everything is black except pure white
        //    if(lum<255 && getRandomArbitrary((255-lum), 255) > 255 - (255-(255-lum))/2 )
        if (Math.random() * 100 > params['whiteNoise']) {
          if (index >= pixels.length) {
            pixels[index] = new Pixel(x, y, lum)
          } else {
            pixels[index].homeX = x
            pixels[index].homeY = y
          }
          pixels[index].isDying = false
          pixels[index].alpha = 255
          index++
        }
      }
    }
  }

  indexFromWherePixelsAreDying = index

  // Every pixel we do not use anymore
  for (var i = index; i < pixels.length; i++) {
    pixels[i].die()
  }

  // If we wanted to instantly delete unused pixels:
  // pixels.splice(index, pixels.length-index);
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min
}

function body_resize() {
  canvasW = document.body.clientWidth
  canvasH = document.body.clientHeight
  canv.width = canvasW
  canv.height = canvasH
  canvSource.width = canvasW
  canvSource.height = canvasH

  init()
}

wordsTxt.focus()
wordsTxt.value = l.substring(index + 3)

resHalfFloor = Math.floor(resolution / 2)
resHalfCeil = Math.ceil(resolution / 2)

$(function () {
  body_resize()
  timer()
})

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
