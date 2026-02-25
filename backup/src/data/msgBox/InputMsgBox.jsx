import { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function InputMsgBox(props) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);  // ✅ ref 추가

  // 모달 확인 버튼 클릭
  const handleConfirm = () => {
    // // 확인 버튼 클릭 후 추가 동작이 있으면 실행
    if(props.action == 'mod'){ props.handleUpdate(inputValue); }   // 수정하기
    if(props.action == 'del'){ props.handleDelete(inputValue); }   // 삭제하기   

    if (inputValue.trim()) {
      // props.onConfirm(inputValue);  // 입력값을 부모로 전달
      setInputValue('');       // 입력값 초기화
    }      

    props.onClose();      // 모달 종료
  }

  // 모달 취소 버튼 클릭
  const handleCancel = () => {
      setInputValue('');
      props.onClose();      // 모달 종료
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          {/* <h1 className="mb-4">메시지 입력 모달</h1> */}

          {/* Bootstrap Modal */}
          <Modal show={props.showModal} onHide={handleCancel} centered
            enforceFocus={false}  // ✅ Modal의 포커스 강제 적용 해제
            onEntered={() => setTimeout(() => inputRef.current?.focus(), 50)} // ✅ 모달 완전히 열린 후 포커스 
            >
            <Modal.Header style={{backgroundColor: 'lightskyblue', paddingBottom: '16px'}} >
               Cine Park
            </Modal.Header>
            
            <Modal.Body style={{
                        // padding: '12px 30px',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#333',
                        paddingTop: '30px', paddingBottom: '4px'
                    }}>
              <Form>
                <Form.Group className="mb-8" 
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                  <Form.Label style={{ marginBottom: '25px' }}>{props.modalMessage}</Form.Label>
                  <Form.Control
                    ref={inputRef}
                    type="password"
                    placeholder="패스워드를 입력하세요..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    style={{ width: '300px' }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && inputValue.trim()) {
                        handleConfirm();
                      }
                    }}                   
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            
            <Modal.Footer style={{ paddingTop: '20px',
                        border: 'none',
                        justifyContent: 'center',
                        paddingBottom: '28px',
                        gap: '10px'
                    }}>
              <Button 
                variant="primary" 
                onClick={handleConfirm}
                disabled={!inputValue.trim()} style={{
                            padding: '10px 30px',
                            borderRadius: '8px'
                        }}
              >
                확인
              </Button>              
              <Button variant="secondary" onClick={handleCancel} style={{
                            padding: '10px 30px',
                            borderRadius: '8px'
                        }}>
                취소
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>
    </div>
  );
}
export default InputMsgBox;