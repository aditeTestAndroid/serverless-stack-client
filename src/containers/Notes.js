import { API, Storage } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import { ControlLabel, FormControl, FormGroup } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import { s3Upload } from "../libs/awsLib";
import { onError } from "../libs/errorLib";
import "./Notes.css";
export const Notes = (props) => {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const loadNote = () => {
      return API.get("notes", `/notes/${id}`);
    };

    const onLoad = async () => {
      try {
        const note = await loadNote();
        const { content, attachment } = note;
        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }
        setContent(content);
        setNote(note);
      } catch (error) {
        onError(error);
      }
    };
    onLoad();
  }, [id]);

  const validateForm = () => {
    return content.length > 0;
  };
  const handleFileChange = (event) => {
    file.current = event.target.files[0];
  };
  const saveNote = (note) => {
    return API.put("notes", `/notes/${id}`, {
      body: note,
    });
  };
  const deleteNote = () => {
    return API.del("notes", `/notes/${id}`);
  };
  const handleDelete = async (event) => {
    let attachment;

    event.preventDefault();

    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }
    setIsDeleting(true);

    try {
      //not deleting S3 bucket data related to note
      await deleteNote();
      history.push("/");
    } catch (error) {
      console.log(error);
      onError(error);
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (event) => {
    let attachment;
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
    setIsLoading(true);
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
      await saveNote({
        content,
        attachment: attachment || note.attachment,
      });
      history.push("/");
    } catch (error) {
      onError(error);
      setIsLoading(false);
    }
  };
  const formatFilename = (str) => {
    return str.replace(/^\w+-/, "");
  };
  return (
    <div className="Notes">
      {note && (
        <form onSubmit={handleSubmit}>
          <FormGroup controlId="content">
            <FormControl
              value={content}
              componentClass="textarea"
              onChange={(e) => setContent(e.target.value)}
            />
          </FormGroup>
          {note.attachment && (
            <FormGroup>
              <ControlLabel>Attachment</ControlLabel>
              <FormControl.Static>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note.attachmentURL}
                >
                  {formatFilename(note.attachment)}
                </a>
              </FormControl.Static>
            </FormGroup>
          )}
          <FormGroup controlId="file">
            {!note.attachment && <ControlLabel>Attachment</ControlLabel>}
            <FormControl onChange={handleFileChange} type="file" />
          </FormGroup>
          <LoaderButton
            block
            type="submit"
            bsSize="large"
            bsStyle="primary"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            bsSize="large"
            bsStyle="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </form>
      )}
    </div>
  );
};
