import React, { createRef } from 'react';
import './ReactImageScaler.scss';

export default class ReactImageScaler extends React.Component {
  constructor(props) {
    super(props);

    this.scaleImage = this.scaleImage.bind(this);
    this.redrawCanvas = this.redrawCanvas.bind(this);
    this.eraseCanvas = this.eraseCanvas.bind(this);
    this.returnData = this.returnData.bind(this);
    this.canvasRef = createRef();
    this.scaleValueRef = createRef();
    this.rangeScaleRef = createRef();

    this.state = {
      canvasWidth: this.props.width ? this.props.width : window.innerWidth,
      canvasHeight: this.props.height ? this.props.height : window.innerHeight,
      imageSource: this.props.src ? this.props.src : null,
      backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : '#FFFFFF'
    }
  }

  componentDidMount() {
    this.rangeScaleRef.current.value = 10;
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
  
    this.image = new Image();
    this.image.src = this.state.imageSource;

    //Initially loads the given image.
    this.image.onload = () => {
      this.redrawCanvas(1);
    }
  }

  renderNoSource() {
    return(
      <div className='scaler-no-source'>
        <span>Image source not provided.</span>
      </div>
    );
  }

  renderControls() {
    return(
      <div className='react-scaler-controls'>
        <div className='control-segment'>
          <span>SCALE   </span>
          <input type='number' ref={this.scaleValueRef} onChange={this.scaleImage}/>
        </div>
        <div className='control-segment'>
          <input type='range' ref={this.rangeScaleRef} step={this.props.scaleStep ? this.props.scaleStep : '0.5'} min='1' max={this.props.maxScale ? this.props.maxScale * 10 : 30} onChange={this.scaleImage}/>
        </div>
        <div className='control-segment'>
          <button onClick={this.returnData}>
            {this.props.buttonMessage ? this.props.buttonMessage : 'Apply'}
          </button>
        </div>
      </div>
    )
  }

  renderCanvas() {
    return(
      <div className='react-scaler'>
        <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight}>

        </canvas>
        {this.renderControls()}
      </div>
    )
  }

  render() {
    return this.state.imageSource ? this.renderCanvas() : this.renderNoSource();
  }

  scaleImage(event) {
    const scale = event.target.value / 10;
    this.scaleValueRef.current.value = scale;
    this.redrawCanvas(scale);
  }

  redrawCanvas(scale) {
    const ctx = this.canvas.getContext('2d');
    this.eraseCanvas(ctx);

    const imageWidth = this.image.width * scale;
    const imageHeight = this.image.height * scale;

    ctx.drawImage(this.image, (this.state.canvasWidth - imageWidth) / 2, (this.state.canvasHeight - imageHeight) / 2, imageWidth, imageHeight);
    this.renderResolution(ctx, imageWidth, imageHeight);
  }

  eraseCanvas(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.state.backgroundColor;
    ctx.resetTransform();
    ctx.rect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    ctx.fill();
  }

  renderResolution(ctx, width, height) {
    ctx.beginPath();
    ctx.fillStyle = '#00000099';
    ctx.resetTransform();
    ctx.rect(0, 0, 85,24);
    ctx.fill();
    ctx.font = '12px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(Math.floor(width) + ' X ' + Math.floor(height), 40, 16);
  }

  returnData() {
    if(this.props.onScaleApply) {
      this.processImageData();
    }
    return null;
  }

  processImageData() {
    const scale = this.scaleValueRef.current.value;
    console.log(scale);
  }
}