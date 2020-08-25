import React from 'react'
import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import styles from './Register.module.css'
import firebase from '../../firebase'
import md5 from 'md5'
class Register extends React.Component{
    state={
        username:'',
        email:'',
        password:'',
        passwordConfirmation:'',
        errors:[],
        loading:false,
        userRef: firebase.database().ref('users'),
    };

    displayErrors = errors => errors.map((error,i) => <p key={i}>{error.message}</p>)

    isFormValid = () =>{
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state) ){
            error={message : "Fill in all the details"}
            this.setState({errors:errors.concat(error)})
        
        }
        else if(!this.isPasswordValid(this.state))
        {
            error = {message: 'Password is not valid'}
            this.setState({errors:errors.concat(error)})
            return false;
        }
        else{
            return true;
        }
    }

    handleInputError=(errors,name) =>{
     return errors.some(error => 
            error.message.toLowerCase().includes(name))? 'error': ''

    }

    isPasswordValid = ({password,passwordConfirmation})=>{
        if(password.length<6 || passwordConfirmation.length<6){
            return false;
        }
        else if(passwordConfirmation !== password){
            return false;
        }
        return true;
    }

    isFormEmpty = ({username,email,password,passwordConfirmation }) =>{
        return !username.length || !email.length || !password.length || !passwordConfirmation.length;
    }

    handleChange = event =>{
        this.setState({
            [event.target.name]:event.target.value
        });
    };


    handleSubmit = event =>{
        event.preventDefault(); 
        if(this.isFormValid()){
            this.setState({errors:[],loading:true})
        firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email,this.state.password)
        .then(createdUser => {
            console.log(createdUser)
            createdUser.user.updateProfile({
                displayName:this.state.username,
                photoURL : `http:gravatar.com/avatar/${md5(
                    createdUser.user.email
                )}?d=identicon`
            }).then(() =>{
                this.saveUser(createdUser)
            })
            this.setState({loading:false})
        })
        .catch(err =>{
            console.error(err)

            this.setState({loading:false,errors:this.state.errors.concat(err)})
        });
    }
    }

    saveUser = (createdUser) =>{
        return this.state.userRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName || "John Doe",
            avatar: createdUser.user.photoURL
        })
    }




    render(){
        const { username ,email,password,passwordConfirmation,errors,loading} = this.state;
        return(
            <Grid textAlign="center" className={styles.app} verticalAlign="middle">
                <Grid.Column style={{maxWidth:450}}>
                    <Header as="h2" icon color ="orange" textAlign="center">
                        <Icon name="puzzle piece" color="blue"/>
                        Register For Devcussions
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit} >
                        <Segment stacked>
                            <Form.Input className={this.handleInputError(errors,'email')} value={email} type="email" fluid name="email" icon="mail" iconPosition="left" placeholder="Email" onChange= {this.handleChange} />
                            <Form.Input className={this.handleInputError(errors,'username')} value={username} type="text" fluid name="username" icon="user" iconPosition="left" placeholder="User Name" onChange= {this.handleChange} />
                            <Form.Input className={this.handleInputError(errors,'password')} value={password} type="password" fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange= {this.handleChange} />
                            <Form.Input className={this.handleInputError(errors,'password')} value={passwordConfirmation} type="password" fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" onChange= {this.handleChange} />
                            <Button className={loading? 'loading' : ''} disabled={loading}  color="blue" fluid size="large">Submit</Button>
                            <Message>Already a user?<Link to="/login">Login</Link> </Message>
                        </Segment>
                    </Form>
                    {this.state.errors.length>0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register;