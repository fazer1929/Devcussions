import React from 'react'
import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import styles from './Register.module.css'
import firebase from '../../firebase'

class Login extends React.Component{
    state={
        email:'',
        password:'',
        errors:[],
        loading:false,
        userRef: firebase.database().ref('users'),
    };

    displayErrors = errors => errors.map((error,i) => <p key={i}>{error.message}</p>)

    handleChange = event =>{
        this.setState({
            [event.target.name]:event.target.value
        });
    };

    handleInputError=(errors,name) =>{
        return errors.some(error => 
               error.message.toLowerCase().includes(name))? 'error': ''
   
       }

       isFormValid= ({email,password}) => email && password


    handleSubmit = event =>{
        event.preventDefault(); 
        if(this.isFormValid(this.state)){
        this.setState({loading:true})

            firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email,this.state.password)
            .then((signedUser) =>{
                console.log(signedUser)
                this.setState({loading:false})
            }).catch(err =>{
                this.setState({errors:this.state.errors.concat(err),loading:false})
            })
        }
    
    }


    render(){
        const { email,password,errors,loading} = this.state;
        return(
            <Grid textAlign="center" className={styles.app} verticalAlign="middle">
                <Grid.Column style={{maxWidth:450}}>
                    <Header as="h2" icon color ="black" textAlign="center">
                        <Icon name="angle double up" color="black"/>
                        Login to Devcussions
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit} >
                        <Segment stacked>
                            <Form.Input className={this.handleInputError(errors,'email')} value={email} type="email" fluid name="email" icon="mail" iconPosition="left" placeholder="Email" onChange= {this.handleChange} />
                            <Form.Input className={this.handleInputError(errors,'password')} value={password} type="password" fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange= {this.handleChange} />
                            <Button className={loading? 'loading' : ''} disabled={loading}  color="black" fluid size="large">Submit</Button>
                            <Message>Don't have an account?<Link to="/register">Register</Link> </Message>
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

export default Login;