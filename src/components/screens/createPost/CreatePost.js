import React, { useState, useContext, useEffect } from "react";
import "./create-post.scss";
import { cloudinary } from "../../../config";
import axios from "../../../helpers/axios";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import { Button, Checkbox, Form, Input, Modal, Image, Card, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";
import { SnackbarContext } from "../../../App";

const { TextArea } = Input;

const CreatePost = () => {
  const { handleSnackBar } = useContext(SnackbarContext);
  const history = useHistory();
  const [data, setData] = useState({
    title: "",
    body: "",
  });

  const [image, setImage] = useState("");
  const [publisedImageUrl, setPublishedImageUrl] = useState("");

  const [submitLoader, setSubmitLoader] = useState(false);

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    setData((preVal) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  // when state changes this function gets kicked
  useEffect(() => {
    if (publisedImageUrl) {
      post();
    }
  }, [publisedImageUrl]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // posting data to database
  function post() {
    let payload = {
      title,
      body,
      pic: publisedImageUrl,
    };
    axios
      .post("/createpost", payload, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
      .then((res) => {
        console.log(res);
        message.success("Successfully posted !!", [1], () => {
          history.push("/");
        });
      })
      .catch((err) => {
        console.log(err.response);
        message.error("Error: " + err.response.data.error);
      });
  }
  // posting Image to cloudinary
  const postImage = () => {
    setSubmitLoader(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "circle");
    data.append("cloud_name", "kammy");
    fetch(cloudinary.apiUrl, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitLoader(false);
        console.log(data);
        if (data.error) {
          message.error(data.error.message + "  and fields");
          return;
        } else {
          setPublishedImageUrl(data.secure_url);
        }
      })
      .catch((err) => {
        setSubmitLoader(false);
        message.error("Error while uploading image");
      });
  };

  // submit the form
  const handleSubmit = (e) => {
    e.preventDefault();
    postImage();
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}>
        Upload
      </div>
    </div>
  );

  const { title, body } = data;
  return (
    <div className='postcard-container'>
      <Card title='Create Your Post' bordered={true} className='card-holder'>
        <Form
          name='basic'
          className='post-form'
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete='off'>
          <Form.Item
            label='Title'
            name='title'
            rules={[
              {
                required: true,
                message: "Please enter post title",
              },
            ]}>
            <Input value={title} name='title' placeholder='Enter Title' onChange={handleFormDataChange} id='title' />
          </Form.Item>

          <Form.Item
            label='Message'
            name='body'
            rules={[
              {
                required: true,
                message: "Please enter message for post",
              },
            ]}>
            <TextArea rows={2} value={body} name='body' placeholder='Enter Message' onChange={handleFormDataChange} id='body' />
          </Form.Item>

          <Form.Item
            label='Upload picture'
            name='image'
            rules={[
              {
                required: true,
                message: "Please upload the picture first",
              },
            ]}>
            <div>
              <input onChange={onImageChange} type='file' multiple accept='image/*' />
            </div>

            {image && (
              <div className='image-preview-holder'>
                <Image src={image} />
              </div>
            )}
          </Form.Item>

          <div className='submit-btn-holder'>
            <Button onClick={handleSubmit} disabled={!title || !body || !image} loading={submitLoader} type='primary' htmlType='submit'>
              Create post
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default CreatePost;

// Old Approach Post Form
{
  /* <form onSubmit={handleSubmit}>
        <div className='input-field col s6'>
          <input value={title} name='title' onChange={InputValue} id='title' type='text' className='validate' />
          <label htmlFor='title'>Title</label>
        </div>

        <div className='input-field col s6'>
          <input value={body} name='body' onChange={InputValue} id='body' type='text' className='validate' />
          <label htmlFor='body'>Message</label>
        </div>

        <div className='file-field input-field'>
          <div className='btn upldbtn  #64b5f6 blue lighten-1'>
            <span>Upload photo</span>
            <input onChange={onImageChange} type='file' multiple accept='image/*' />
          </div>
          {image ? (
            <div className='avatar-preview'>
              <img id='imagePreview' src={image} className='' alt='avatar' />
            </div>
          ) : (
            <span id='nophoto'>No photo choosen</span>
          )}
        </div>

        <button type='submit' className='btn waves-effect mt-3 waves-light #64b5f6 blue lighten-1'>
          Create post
        </button>
      </form> */
}
