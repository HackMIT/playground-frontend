import balloon from '../../images/balloon.svg';
import cloud from '../../images/cloud.svg';
import flippedCloud from '../../images/cloud_flipped.svg';
import '../../styles/loading.scss';

// eslint-disable-next-line
import createElement from '../../utils/jsxHelper';

export default function createLoadingScreen() {
  return (
    <div id="loading">
      <img src={cloud} id="cloud1" />
      <img src={flippedCloud} id="cloud2" />
      <img src={balloon} id="balloon" />
      <p className="loading-text">Loading...</p>
    </div>
  );
}
