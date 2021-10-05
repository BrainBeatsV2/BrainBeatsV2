import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
// const { ipcRenderer } = window.require('electron');
// const { ipcRenderer } = window.require('electron');



import { Button, Checkbox, Grid, Modal, Header , Segment, Dimmer, Loader} from 'semantic-ui-react'
class MusicGeneration extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            name: "React",
            recording: false,
            disabledFields: '',
            cancelButton: false,
            showMenu: false,
            saveOptions: false,
            playing: false,
            isEEGScriptRunning: false,
            model: 1,
            instrument: 1,
            key: "C",
            scale: "Pentatonic",
            timing: "4/4",
            bpm: 120,
            minRange: 3,
            maxRange: 3,
            headsetMode: 'Synthetic',
            saveModalOpen: false,
            saving: false,
            saved: false,
            privacySettings: 0,
            trackLink: "brainbeats.dev/play/",
            loggedout: 0,
            midiString: ''

        };
        this.onStartRecording = this.onStartRecording.bind(this);
        this.onStopRecording = this.onStopRecording.bind(this);
        this.onShowMenu = this.onShowMenu.bind(this);
        this.onHideMenu = this.onHideMenu.bind(this);
        this.onStartPlaying = this.onStartPlaying.bind(this);
        this.onStopPlaying = this.onStopPlaying.bind(this);
        this.onReRecord = this.onReRecord.bind(this);
        this.onDecreaseMin = this.onDecreaseMin.bind(this);
        this.onDecreaseMax = this.onDecreaseMax.bind(this);
        this.onIncreaseMin = this.onIncreaseMin.bind(this);
        this.onIncreaseMax = this.onIncreaseMax.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.onSynthetic = this.onSynthetic.bind(this);
        this.onGanglion = this.onGanglion.bind(this);
        this.setOpen = this.setOpen.bind(this);
        this.onSaveRecording = this.onSaveRecording.bind(this);
        this.onChangeTrackSettings = this.onChangeTrackSettings.bind(this);
        

    }
    // Start MIDI Recording
    onStartRecording() {
        this.setState({
            recording: true,
            saveOptions: false,
            disabledFields : 'disabled'
        });

        // If not running the EEG Script, then run it!
        if (!this.state.isEEGScriptRunning) {
            console.log('Started recording!')
            window.ipcRenderer.send('start_eeg_script');
            window.ipcRenderer.on('start_eeg_script', (event, args) => {
                console.log(args)
            })
        }
        this.setState({ isEEGScriptRunning: !this.state.isEEGScriptRunning })
    }
    
    // Stop MIDI Recording
    onStopRecording() {
        this.setState({
            recording: false,
            saveOptions: true,
            disabledFields : ''
        });

        // If EEG Script is running, stop it right now
        if (this.state.isEEGScriptRunning) {
            console.log('Ended recording!')
            window.ipcRenderer.send('end_eeg_script');
            window.ipcRenderer.on('end_eeg_script', (event, args) => {
                console.log(args)
                this.setState({ midiString: args })
               // this.player.load(args)
                //this.player.play()
                
                window.ipcRenderer.send('gen_midi');
            })
        }
        this.setState({ isEEGScriptRunning: !this.state.isEEGScriptRunning })
    }

    // Start Playing MIDI
    onStartPlaying() {
        this.setState({
            playing: true
        });
        window.ipcRenderer.send('play_midi');

    }
    // Paused MIDI
    onStopPlaying() {
        this.setState({
            playing: false
        });
        window.ipcRenderer.send('pause_midi');
    }
    // Re-record MIDI
    onReRecord() {
        this.setState({
            playing: false,
            saveOptions: false,
            recording: false
        });
    }
    // Show Account Menu
    onShowMenu() {
        this.setState({
            showMenu: true
        });
    }
    // Hide Account Menu
    onHideMenu() {
        this.setState({
            showMenu: false
        });
    }
    // Range : Decreased Min
    onDecreaseMin()
    {
        if (this.state.minRange > 1)
        {
            this.setState({
                minRange: (this.state.minRange - 1)
            });
        }
    }
    // Range : Decreased Max
    onDecreaseMax()
    {
        // Decrease max as long as max >= min
        if (this.state.maxRange > this.state.minRange)
        {
            this.setState({
                maxRange: (this.state.maxRange - 1)
            });
        }
    }
    // Range : Increase Min
    onIncreaseMin()
    {
        // Increase min as long as min <= max
        if (this.state.minRange < this.state.maxRange)
        {
            this.setState({
                minRange: (this.state.minRange + 1)
            });
        }
    }
    // Range : Increase Max
    onIncreaseMax()
    {
        if (this.state.maxRange < 7)
        {
            this.setState({
                maxRange: (this.state.maxRange + 1)
            });
        }
    }

    updateRange()
    {
        console.log("updated")
    }
    // Clicking Synthetic
    onSynthetic()
    {
        if (this.state.headsetMode == "Ganglion")
        {
            this.setState({
                headsetMode: 'Synthetic'
            })
        }

    }
    // Clicking Ganglion
    onGanglion()
    {
        if (this.state.headsetMode == "Synthetic")
        {
            this.setState({
                headsetMode: 'Ganglion'
            })
        }
    }
    setOpen()
    {
        this.setState({
            saveModalOpen: !this.state.saveModalOpen
        })
    }
    // Clicking Save and Upload and show loading screen
    onSaveRecording()
    {
        this.setState({
            saving: true,
            saved:true
        })
        setTimeout(
            function() {
                this.setState({
                    saving: false,
                    saved:true
                })
            }
            .bind(this),
            3000
        );
    }
    // Radio Button privacy settings switch

    // Save Settings Button
    onChangeTrackSettings()
    {
        this.setState({
            privacySettings: this.state.privacySettings,
            saveModalOpen: !this.state.saveModalOpen
        })

    }

	handleTrackName = (e) => {
		this.setState({ trackName: e.target.value });
	};
    changePrivacy = (e, { value }) => this.setState({ privacySettings: value });
    render() {
        return (


            <div class="music-generation-bg"> 
                <Dimmer.Dimmable dimmed={this.state.saving}>
                <Dimmer active={this.state.saving} page>
                    <Loader>Uploading</Loader>
                </Dimmer>

                
                </Dimmer.Dimmable>

                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <div className="nav__button" onClick={this.onShowMenu} onMouseEnter={this.onShowMenu} onMouseLeave={this.onHideMenu}><i class="material-icons">account_circle</i>

                    <ul className="nav__menu" style={{ display: this.state.showMenu ? 'block' : 'none' }}>
                        <li className="nav_menu-item"><a href="#">My Account</a></li>
                        <li className="nav_menu-item"><a href="#">Settings</a></li>
                        <li className="nav_menu-item"><a href="#">Log Out</a></li>
                    </ul>
                </div>
                <a id="back" href="/dashboard" style={{display: this.state.loggedout ? 'none': 'block'}}><i class="material-icons" >chevron_left</i> <span>DASHBOARD</span></a>
                
                <div id="headset_selection" class="">
                    <p>{this.state.headsetMode} Mode</p>
                    <i class="material-icons" onClick={this.onSynthetic} style={{ color: (this.state.headsetMode == 'Synthetic') ? '#4d90fe' : '#000000' }}>memory</i>
                    <i class="material-icons" onClick={this.onGanglion} style={{ color: (this.state.headsetMode == 'Ganglion') ? '#4d90fe' : '#000000' }}>headset</i>
                </div>
    
                <div class="stream">
                    Insert Brain Wave Visualizer Concept Here
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="stream-bar">
                    <div class="column">
                        <div id="rerecord" style={{ display: this.state.saveOptions ? 'block' : 'none', float: 'right' }}>

                            <table >
                                <tr>

                                    <td ><i style={{ display: this.state.saved ? 'none' : 'block' }} class="material-icons" onClick={this.onReRecord}>backspace</i></td>

                                </tr>
                                <tr>

                                    <th ><span style={{ display: this.state.saved ? 'none' : 'block' }}>Record Again</span></th>
                                </tr>
                            </table>
                        </div>
                        <div id="model_selection" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <table>
                                <tr>
                                    <th>MODEL</th>
                                    <th>INSTRUMENT</th>
                                    
                                    <th>MIN</th>
                                    <th>MAX</th>
                                </tr>
                                <tr>
                                    <td>
                                        <select id="parameter_model" disabled={this.state.recording}>
                                            <option>Model 1</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_instrument" disabled={this.state.recording}>
                                            <option value="1">Piano</option>
                                            <option value="13">Xylophone</option>
                                            <option value="19">Organ (Church)</option>
                                            <option value="24">Guitar (Acoustic)</option>
                                            <option value="27">Guitar (Electric)</option>
                                            <option value="40">Violin</option>
                                            <option value="41">Viola</option>
                                            <option value="42">Cello</option>
                                            <option value="48">Strings</option>
                                            <option value="56">Trumpet</option>
                                        </select>
                                    </td>
                                    <td><i class="material-icons changeOctave noselect" onClick={this.onDecreaseMin}>chevron_left</i> <input  type="text" class="border-input range"  onChange={this.updateRange} value={this.state.minRange} disabled={this.state.recording} /> <i class="material-icons changeOctave noselect" onClick={this.onIncreaseMin}>chevron_right</i></td>
                                    <td><i class="material-icons changeOctave noselect " onClick={this.onDecreaseMax}>chevron_left</i> <input type="text" class="border-input range"  onChange={this.updateRange} value={this.state.maxRange} disabled={this.state.recording} /> <i class="material-icons changeOctave noselect" onClick={this.onIncreaseMax}>chevron_right</i></td>
                             
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="column">
                        <div id="play_stream" style={{ display: this.state.saveOptions ? 'block' : 'none' }}>
                            <i class="material-icons" onClick={this.onStartPlaying} style={{ display: this.state.playing ? 'none' : 'inline-block' }}>play_circle_filled</i>
                            <i class="material-icons" onClick={this.onStopPlaying} style={{ display: this.state.playing ? 'inline-block' : 'none' }}>pause</i>

                        </div>
                        <div id="start_stream" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <i class="material-icons" onClick={this.onStartRecording} style={{ display: this.state.recording ? 'none' : 'inline-block' }}>radio_button_unchecked</i>
                            <i class="material-icons" onClick={this.onStopRecording} style={{ color: 'red', display: this.state.recording ? 'inline-block' : 'none' }}>radio_button_checked</i>
                        </div>
                    </div>
                    <div class="column">
                        <div id="saveoptions" style={{ display: this.state.saveOptions ? 'block' : 'none' }}>
                            <table class="save_options">
                                <tr>

                                    <td><i class="material-icons">file_download</i></td>
                                    <td style={{ display: (this.state.saved || this.state.loggedout) ? 'none' : 'block' }}><i class="material-icons" onClick={this.onSaveRecording} >cloud_upload</i></td>
                                    <Modal
                                        onClose={this.setOpen}
                                        onOpen={this.setOpen}
                                        open={this.state.saveModalOpen}
                                        trigger={<td style={{ display: (this.state.saved) ? 'block' : 'none' }}><i class="material-icons" >ios_share</i></td>    }
                                        closeOnDimmerClick={false} >
                                    <Modal.Header>Track Settings</Modal.Header>
                                    <Modal.Content text>
                                        
                                        <Modal.Description>
                                        
                                        <Header>Sharing and Privacy Settings</Header>
                                        <Checkbox input onChange={this.changePrivacy} value='0' checked={this.state.privacySettings == 0} radio label='Track is visible on MIDI Discover section' />
                                        <br />
                                        <Checkbox onChange={this.changePrivacy} value='1' checked={this.state.privacySettings == 1} radio label='Track is only visible to anyone with my link' />
                                        <br />
                                        <Checkbox onChange={this.changePrivacy} value='2' checked={this.state.privacySettings == 2} radio label='Track is only visible to me' />
                                        <br />
                                        <br />
                                        
                                        MIDI Link: <input className="modal_input" value={this.state.trackLink} type="text" readOnly={true}/>
                                        </Modal.Description>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='black' onClick={this.setOpen}>
                                        Close
                                        </Button>
                                        <Button
                                        content="Save Settings"
                                        labelPosition='right'
                                        icon='checkmark'
                                        onClick={this.onChangeTrackSettings}
                                        positive
                                        />
                                    </Modal.Actions>
                                    </Modal>
                                    
                                </tr>
                                <tr>

                                    <th>Download MIDI</th>
                                    <th style={{ display: (this.state.saved || this.state.loggedout) ? 'none' : 'block' }}>Save and Upload</th>
                                    <th style={{ display: this.state.saved ? 'block' : 'none' }}>Share</th>
                                </tr>
                            </table>
                        </div>
                        <div id="parameters" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <table>
                                <tr>
                                    <th>KEY</th>
                                    <th>SCALE</th>
                                    <th>TIMING</th>
                                    <th>BPM</th>
                                 
                                </tr>
                                <tr>
                                    <td>
                                        <select id="parameter_key" disabled={this.state.recording}>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                            <option value="E">E</option>
                                            <option value="F">F</option>
                                            <option value="G">G</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_scale" disabled={this.state.recording}>
                                            <option value="pentatonic">Pentatonic</option>
                                            <option value="chromatic">Chromatic</option>
                                            <option value="whole_tone">Whole Tone</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_timing" disabled={this.state.recording}>
                                            <option>4/4</option>
                                            <option>2/4</option>
                                            <option>2/2</option>
                                            <option>6/8</option>

                                        </select>
                                    </td>
                                    <td><input id="parameter_bpm" type="text" class="border-input bpm" defaultValue="120" disabled={this.state.recording} /></td>
                                       </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default MusicGeneration