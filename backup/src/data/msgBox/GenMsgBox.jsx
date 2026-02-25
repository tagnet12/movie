import { Modal, Button } from 'react-bootstrap';

function GenMsgBox(props){

    // 모달 확인 버튼 클릭
    const handleConfirm = () => {
      props.onClose();      // 모달 종료

      // 확인 버튼 클릭 후 추가 동작이 있으면 실행
      if(props.callBack) {
        props.callBack();
      }
    }

    return(
        <div>
             {/* 일반 알림 모달 */}
                <Modal show={props.showModal} onHide={handleConfirm} onExited={props.onExited} centered>
                    <Modal.Header style={{backgroundColor: 'lightskyblue'}}> Cine Park </Modal.Header>
                    <br></br>
                    <Modal.Body style={{
                        padding: '12px 30px',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: '500',
                        color: '#333'
                    }}>
                        {props.modalMessage}
                    </Modal.Body>
                    <Modal.Footer style={{
                        border: 'none',
                        justifyContent: 'center',
                        paddingBottom: '30px',
                        gap: '10px'
                    }}>
                        <Button variant="primary" onClick={handleConfirm} style={{
                            padding: '10px 30px',
                            borderRadius: '8px'
                        }}>
                            확인
                        </Button>
                    </Modal.Footer>
                </Modal>
        </div>
    )
}

export default GenMsgBox;